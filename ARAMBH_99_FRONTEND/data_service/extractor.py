import os
import time
from pymongo import MongoClient  # For connecting to MongoDB

# MongoDB connection URI and database details
mongodb_url = "mongodb+srv://arambh_99:Bhairab_SIH2024@ace.t70it.mongodb.net/Ace"
database_name = "Ace"


def convert_to_code_format(file_path):
    """
    Reads a text file, converts its content into a single-line string with escape sequences,
    and rewrites the same file with the transformed content.
    """
    try:
        # Read the content of the file
        with open(file_path, "r") as file:
            text = file.read()
        
        # Replace newlines with escaped newline
        formatted_text = text.replace("\n", "\\n")
        
        # Rewrite the same file with the formatted text
        with open(file_path, "w") as file:
            file.write(formatted_text)
        
        print("File transformed successfully.")
    except Exception as e:
        print(f"An error occurred: {e}")




# Function to format the text data from the raw MongoDB dump
def format_data(input_path, output_path):
    try:
        # Ensure the output directory exists
        output_dir = os.path.dirname(output_path)
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        # Read the input file
        with open(input_path, "r", encoding="utf-8") as infile, open(output_path, "w", encoding="utf-8") as outfile:
            lines = infile.readlines()
            formatted_lines = []
            for line in lines:
                # Skip lines with MongoDB-specific details
                if "ObjectId" in line or "_id" in line:
                    continue
                
                # Add meaningful formatting
                if line.startswith("College:"):
                    formatted_lines.append("\n" + line.strip() + "\n" + "-" * 50 + "\n")  # Add a separator
                elif ":" in line:
                    key, value = line.split(":", 1)
                    key = key.strip().capitalize()
                    value = value.strip()
                    formatted_lines.append(f"{key}: {value}\n")
                else:
                    formatted_lines.append(line.strip() + "\n")

            # Write the formatted output
            outfile.writelines(formatted_lines)

        print(f"Formatted data saved to {output_path}")
    except Exception as e:
        print(f"Error formatting data: {e}")


# Paths to input and output files
input_file_path = "./data.txt"  # Original file path
output_file_path = "../public/data/dbdata.txt"  # Path for formatted output


# Task to fetch data from the "college" collection and save it to a text file
def fetch_and_save():
    try:
        client = MongoClient(mongodb_url)
        db = client[database_name]
        print(f"Connected to MongoDB database: {database_name}")
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        return

    # Target collection name
    collection_name = "colleges"
    collection = db[collection_name]

    # Define output text file path
    output_path = r"./data.txt"
    output_dir = os.path.dirname(output_path)
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Open the output file
    try:
        with open(output_path, "w", encoding="utf-8") as file:
            try:
                data = list(collection.find())
                if not data:
                    print(f"No data found in the '{collection_name}' collection.")
                    file.write(f"No data found in the '{collection_name}' collection.\n")
                    return
            except Exception as e:
                print(f"Error fetching data from '{collection_name}': {e}")
                file.write(f"Error fetching data from '{collection_name}': {e}\n")
                return
            count = 1
            for document in data:
                # Get college name
                
                college_name = document.get("college_name", "Unknown College")
                file.write(f"College: {count}\n")  # College name as heading
                count+=1

                # Extract and write details dynamically
                for key, value in document.items():
                    # Exclude "_id" field and ensure only valid fields are included
                    if key == "_id":
                        continue
                    
                    # If the field is a list or dictionary, convert it into readable text
                    if isinstance(value, list):
                        value = ", ".join(map(str, value))
                    elif isinstance(value, dict):
                        value = "; ".join([f"{k}: {v}" for k, v in value.items()])

                    # Write the key and value in paragraph format with "\n" between them
                    file.write(f"{key}: {value}\n")

                # Add a blank line after each college's details
                file.write("\n\n")
        print(f"Task completed: File saved to {output_path}")
        # Format the data
        format_data(input_file_path, output_file_path)
        # Save the formatted data to a new file named - formatted_data.txt
        formatted_file_path = "../public/data/formatted_data.txt"
        format_data(output_file_path, formatted_file_path)
        convert_to_code_format(output_file_path)
    except Exception as e:
        print(f"Error writing to file: {e}")




# Run the task every 1 hour (3600 seconds)
while True:
    fetch_and_save()
    print("Waiting for 1 min...")
    time.sleep(60)