from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from flask_cors import CORS  # Import CORS

app = Flask(__name__)

# Enable CORS for all routes (you can configure specific origins if needed)
CORS(app, resources={r"/scrape": {"origins": "http://localhost:5173"}}) 


# Set of visited URLs to prevent revisiting
visited_urls = set()

# Function to save content
def append_content(url, content):
    return {
        "url": url,
        "content": content,
    }

# Function to check if a URL points to a media file or unwanted pattern
def is_media_or_unwanted_file(url):
    media_extensions = [".mp3", ".mp4", ".avi", ".mov", ".jpg", ".jpeg", ".png", ".gif", ".webp", ".pdf"]
    unwanted_patterns = ["/download/document/"]
    return any(url.lower().endswith(ext) for ext in media_extensions) or \
           any(pattern in url.lower() for pattern in unwanted_patterns)

# Function to check if URL belongs to the allowed endpoint
def is_allowed_url(url, base_endpoint):
    return url.startswith(base_endpoint)

# Function to scrape a webpage and follow links
def scrape_website(url, base_endpoint):
    global visited_urls
    # Prevent revisiting the same URL
    if url in visited_urls or is_media_or_unwanted_file(url) or not is_allowed_url(url, base_endpoint):
        return []

    print(f"Scraping: {url}")
    visited_urls.add(url)
    scraped_data = []

    try:
        # Fetch the webpage
        response = requests.get(url, timeout=10)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"Failed to fetch {url}: {e}")
        return []

    # Parse the webpage
    soup = BeautifulSoup(response.text, "html.parser")

    # Save the page content
    scraped_data.append(append_content(url, soup.get_text(strip=True)))

    # Find all links on the page and follow them
    for link in soup.find_all("a", href=True):
        next_url = urljoin(url, link["href"])
        # Normalize URL to prevent revisiting with different formats
        next_url = next_url.split("#")[0]  # Remove fragment identifiers
        scraped_data.extend(scrape_website(next_url, base_endpoint))

    return scraped_data

@app.route('/scrape', methods=['POST'])
def scrape_endpoint():
    global visited_urls
    visited_urls.clear()  # Reset visited URLs for each new scrape session

    data = request.get_json()
    if not data or 'url' not in data:
        return jsonify({"error": "Invalid request. 'url' is required."}), 400

    starting_url = data['url']
    base_endpoint = data.get('base_endpoint', starting_url)

    print("Starting web scraping...")
    scraped_content = scrape_website(starting_url, base_endpoint)
    print("Scraping completed.")

    return jsonify(scraped_content)

if __name__ == '__main__':
    app.run()
