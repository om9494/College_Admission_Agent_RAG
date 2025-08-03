import os
import json
from urllib.parse import urljoin
import requests
from bs4 import BeautifulSoup
from pathlib import Path
import logging
from pymongo import MongoClient
from dotenv import load_dotenv
import csv

logging.basicConfig(level=logging.INFO)

# Load the .env file
load_dotenv()

# Retrieve MongoDB URI from the .env file
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise ValueError("MongoDB URI is not set in the .env file")

# Connect to MongoDB
client = MongoClient(MONGO_URI)

# Specify the database and collection
db_name = os.getenv("DB_NAME")  # Set your database name in .env as DB_NAME
collection_name = os.getenv("COLLECTION_NAME")  # Set your collection name in .env as COLLECTION_NAME

db = client[db_name]
collection = db[collection_name]


def scrape_announcements():
    url = "https://dte.rajasthan.gov.in"
    announcements = []

    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()  # Raise exception for HTTP errors
        soup = BeautifulSoup(response.content, "html.parser")
        announcements_div = soup.find("div", class_="marquee")

        if announcements_div:
            for li in announcements_div.find_all("li"):
                link_tag = li.find("a")
                if link_tag:
                    text = link_tag.text.strip()
                    href = link_tag.get("href", "").strip()
                    full_link = urljoin(url, href) if href else None

                    if full_link:
                        announcements.append({
                            "title": "DTE Announcement",
                            "description": text,
                            "link": full_link
                        })
        else:
            logging.warning("Announcements div not found.")

    except requests.exceptions.RequestException as e:
        logging.error(f"Error while scraping the announcements: {e}")

    return announcements


def save_to_json(new_announcements, filename="announcements.json"):
    # Load the existing data from the announcements.json file
    try:
        # Query to fetch all documents with `notification` as true and containing an email
        email_field = os.getenv("EMAIL_FIELD", "email")  # Set your email field name in .env
        emails = collection.find(
            {"notification": True, email_field: {"$exists": True}}, {email_field: 1, "_id": 0}
        )

        # CSV file to save the emails
        output_file = "recipients.csv"

        # Clean the file before writing
        with open(output_file, mode="w", newline="") as file:
            writer = csv.writer(file)
            writer.writerow(["email"])  # Write header
            for record in emails:
                writer.writerow([record[email_field]])

        print(f"Filtered emails have been extracted and saved to {output_file}")

        if os.path.exists(filename):
            with open(filename, "r") as file:
                existing_announcements = json.load(file)
        else:
            existing_announcements = []

        # Merge the new announcements with the existing ones
        # Make sure we don't duplicate announcements by matching on 'link'
        for new_announcement in new_announcements:
            # Check if this announcement is already in the existing list
            if not any(ann['link'] == new_announcement['link'] for ann in existing_announcements):
                existing_announcements.append(new_announcement)

        # Save the merged data back to the file
        with open(filename, "w") as file:
            json.dump(existing_announcements, file, indent=4)
        logging.info(f"Data saved to {filename}")
        print(f"Data saved to {filename}")

    except Exception as e:
        print(f"Error saving data to {filename}: {e}")
        logging.error(f"Error saving data to {filename}: {e}")

def import_new_users_to_json(json_file="new_users.json"):
    """
    Fetches user email addresses and names from MongoDB and saves them to a JSON file.
    If a user already exists in the JSON file, they are skipped.

    Parameters:
        json_file (str): Path to the JSON file to save new user data.
    """
    try:
        # Load existing users from the JSON file
        existing_users = []
        if os.path.exists(json_file):
            with open(json_file, "r") as file:
                existing_users = json.load(file)

        existing_emails = {user["email"] for user in existing_users}

        # Fetch new users from MongoDB
        users = collection.find(
            {"email": {"$exists": True}},
            {"email": 1, "name": 1, "_id": 0}
        )

        new_users = []
        for user in users:
            email = user.get("email")
            name = user.get("name", "User")
            if email and email not in existing_emails:
                new_users.append({"email": email, "name": name, "welcome_sent": False})

        # Merge new users into the existing list
        all_users = existing_users + new_users

        # Save to JSON
        with open(json_file, "w") as file:
            json.dump(all_users, file, indent=4)

        logging.info(f"Successfully imported {len(new_users)} new users to {json_file}.")
        print(f"Successfully updated {json_file} with new users.")

    except Exception as e:
        logging.error(f"Error importing new users: {e}")
        print(f"Error importing new users: {e}")



if __name__ == "__main__":
    new_announcements = scrape_announcements()
    if new_announcements:
        save_to_json(new_announcements)
    else:
        logging.info("No new announcements found.")

