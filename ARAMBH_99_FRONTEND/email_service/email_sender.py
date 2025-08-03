import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import os
import logging
import json
from typing import List, Dict
import csv
from web_scraping import save_to_json


# Retrieve SMTP server details from the .env file


SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

# Logging configuration
logging.basicConfig(
    filename='email_service.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# HTML template for the email
HTML_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <title>{title}</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }}
        .container {{
            width: 600px;
            margin: auto;
            background-color: #ffffff;
            border: 1px solid #dddddd;
            border-radius: 8px;
            padding: 20px;
        }}
        h1 {{
            color: #db2727;
            text-align: center;
        }}
        p {{
            line-height: 1.5;
            font-size: 16px;
        }}
        a {{
            color: #007bff;
            text-decoration: none;
        }}
    </style>
</head>
<body>
    <div class="container">
        <img src="https://i.ibb.co/DWpPyDV/DEPAARTMENT-OF-TECHNICAL-EDUCATION.png" alt="DTE Logo" style="width: 100%; border-radius: 8px;">
        <h1>{title}</h1>
        <p>{description}</p>
        {link_html}
        <p>Best regards,<br><strong>DTE Rajasthan Team</strong></p>
    </div>
</body>
</html>
"""

HTML_TEMPLATE2 = """
<!DOCTYPE html>
<html>
<head>
    <title>Welcome to ACE – Your Admission Guide!</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
        }}
        .container {{
            width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border: 1px solid #dddddd;
            border-radius: 8px;
            padding: 20px;
        }}
        h1 {{
            color: #007bff;
            text-align: center;
            margin-bottom: 20px;
        }}
        p {{
            line-height: 1.6;
            font-size: 16px;
            color: #333333;
        }}
        ul {{
            list-style: none;
            padding: 0;
            margin: 0 0 20px 0;
        }}
        ul li {{
            margin: 10px 0;
            padding-left: 25px;
            background: url('https://img.icons8.com/?size=100&id=lRv2C3HX0jD7&format=png&color=000000') no-repeat left center;
            background-size: 18px 18px;
        }}
        .cta {{
            text-align: center;
            margin: 20px 0;
        }}
        .cta a {{
            display: inline-block;
            padding: 12px 20px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
            font-size: 16px;
        }}
        .cta a:hover {{
            background-color: #0056b3;
        }}
        footer {{
            text-align: center;
            font-size: 14px;
            color: #666666;
            margin-top: 20px;
        }}
    </style>
</head>
<body>
    <div class="container">
    <img src="https://i.ibb.co/DWpPyDV/DEPAARTMENT-OF-TECHNICAL-EDUCATION.png" alt="DTE Logo" style="width: 100%; border-radius: 8px;">
        <h1>Welcome to ACE – Your Admission Guide! 🎓</h1>
        <p>Dear <strong>{name}</strong>,</p>
        <p>Welcome to <strong>ACE</strong> – your trusted partner for polytechnic admissions in Rajasthan!</p>
        <p>Here’s what ACE offers:</p>
        <ul>
            <li>Up-to-date info on polytechnic colleges.</li>
            <li>Personalized admission guidance.</li>
            <li>Instant answers through our chatbot.</li>
        </ul>
        <p><strong>Get Started in 3 Easy Steps:</strong></p>
        <ul>
            <li><strong>Explore:</strong> Access our resources anytime.</li>
            <li><strong>Ask:</strong> Get answers from our chatbot.</li>
            <li><strong>Stay Updated:</strong> Never miss important dates and news.</li>
        </ul>
        <div class="cta">
            <a href="https://arambh-99.vercel.app/" target="_blank">Start Using ACE</a>
        </div>
        <p>We’re here to make your admission journey seamless.</p>
        <footer>
            <p>Warm regards,<br><strong>The ACE Team</strong></p>
            <p>📧 dte_raj@rajasthan.gov.in | 📞 0291-2434395 | 🌐 <a href="https://dte.rajasthan.gov.in/" target="_blank">DTE Rajasthan</a></p>
        </footer>
    </div>
</body>
</html>
"""



def parse_announcements(json_file: str) -> List[Dict]:
    """
    Parses the announcements JSON file to extract relevant data.

    Parameters:
        json_file (str): Path to the announcements JSON file.

    Returns:
        List[Dict]: A list of dictionaries containing title, description, and links.
    """
    try:
        with open(json_file, 'r') as file:
            announcements = json.load(file)
        logging.info(f"Successfully parsed {len(announcements)} announcements from {json_file}.")
        return announcements
    except Exception as e:
        logging.error(f"Error reading announcements JSON file: {e}")
        return []


def generate_email_body(announcement: Dict) -> str:
    """
    Generates the email body using the HTML template and announcement data.

    Parameters:
        announcement (Dict): A dictionary with 'title', 'description', and 'link'.

    Returns:
        str: The populated HTML email body.
    """
    link_html = ""
    if "link" in announcement and announcement["link"]:
        if announcement["link"].endswith(".pdf"):
            link_html = f'<p><a href="{announcement["link"]}" target="_blank">Click here to view the PDF</a></p>'
        else:
            link_html = f'<p><a href="{announcement["link"]}" target="_blank">Read more</a></p>'
    
    email_body = HTML_TEMPLATE.format(
        title=announcement.get("title", "No Title"),
        description=announcement.get("description", "No description available."),
        link_html=link_html
    )
    return email_body









def send_email(
    subject: str,
    body: str,
    recipients: List[str],
    sender_email: str = EMAIL_USER
) -> None:
    """
    Sends an email to a list of recipients.

    Parameters:
        subject (str): The email subject.
        body (str): The email body (HTML content).
        recipients (List[str]): A list of recipient email addresses.
        sender_email (str): The sender's email address (default is EMAIL_USER).
    """
    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASSWORD)
            logging.info("Successfully logged into SMTP server.")

            for recipient in recipients:
                try:
                    msg = MIMEMultipart()
                    msg['From'] = sender_email
                    msg['To'] = recipient
                    msg['Subject'] = subject
                    msg.attach(MIMEText(body, 'html'))

                    server.sendmail(sender_email, recipient, msg.as_string())
                    logging.info(f"Email sent successfully to {recipient}.")
                except Exception as e:
                    logging.error(f"Failed to send email to {recipient}: {e}")
    except Exception as e:
        logging.critical(f"Could not connect to SMTP server: {e}")




def send_welcome_email(new_users_file="new_users.json"):
    """
    Sends welcome emails to new users listed in the JSON file.
    Marks emails as sent in the JSON after successful delivery.
    """
    try:
        # Load new user data
        if not os.path.exists(new_users_file):
            logging.info(f"No new users found in {new_users_file}.")
            return
        
        with open(new_users_file, "r") as file:
            new_users = json.load(file)

        # Filter users who haven't received welcome emails
        unsent_users = [user for user in new_users if not user.get("welcome_sent")]
        if not unsent_users:
            logging.info("No unsent welcome emails found.")
            return
        
        # Connect to the SMTP server
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASSWORD)
            logging.info("SMTP server login successful.")
            
            for user in unsent_users:
                try:
                    # Generate the email content
                    email_body = HTML_TEMPLATE2.format(name=user["name"])
                    msg = MIMEMultipart()
                    msg['From'] = EMAIL_USER
                    msg['To'] = user["email"]
                    msg['Subject'] = "Welcome to ACE – Your Admission Guide!"
                    msg.attach(MIMEText(email_body, 'html'))

                    # Send the email
                    server.sendmail(EMAIL_USER, user["email"], msg.as_string())
                    logging.info(f"Welcome email sent to {user['email']}.")
                    user["welcome_sent"] = True  # Mark email as sent
                except Exception as e:
                    logging.error(f"Failed to send welcome email to {user['email']}: {e}")

        # Update JSON file with the sent status
        with open(new_users_file, "w") as file:
            json.dump(new_users, file, indent=4)

    except Exception as e:
        logging.error(f"Error sending welcome emails: {e}")






def load_recipients_from_csv(file_path="recipients.csv") -> List[str]:
    """
    Loads the email addresses from a CSV file and returns a list of recipients.

    Parameters:
        file_path (str): The path to the recipients CSV file.

    Returns:
        List[str]: A list of email addresses.
    """
    recipients = []
    try:
        with open(file_path, mode='r', newline='') as file:
            reader = csv.DictReader(file)
            for row in reader:
                email = row["email"].strip()  # Assuming the column name is 'email'
                if email:
                    recipients.append(email)
        logging.info(f"Loaded {len(recipients)} recipients from {file_path}")
    except Exception as e:
        logging.error(f"Error reading {file_path}: {e}")
    return recipients







def update_announcement_status(announcement, filename="announcements.json"):
    """
    Updates the announcement status to indicate the email has been sent.

    Parameters:
        announcement (dict): The announcement that was sent.
        filename (str): The path to the announcements JSON file.
    """
    try:
        # Load the existing announcements data
        with open(filename, 'r') as file:
            announcements = json.load(file)

        # Find the announcement and update its 'sent' status
        for ann in announcements:
            if ann["link"] == announcement["link"]:  # Match by link (or other unique identifier)
                ann["sent"] = True
                break

        # Save the updated data back to the file
        with open(filename, 'w') as file:
            json.dump(announcements, file, indent=4)

        logging.info(f"Updated status of announcement '{announcement['title']}' to 'sent'.")
    except Exception as e:
        logging.error(f"Error updating announcement status: {e}")







def monitor_announcements_and_send_emails():
    """
    Monitors the announcements.json file and sends emails for new announcements.
    """

    send_welcome_email(new_users_file="new_users.json")

    # Load announcements
    announcements = parse_announcements("announcements.json")

    if not announcements:
        logging.warning("No announcements found. Skipping email sending.")
        return

    # Load recipients from CSV
    recipients = load_recipients_from_csv("recipients.csv")

    if not recipients:
        logging.warning("No recipients found. Skipping email sending.")
        return

    # Send emails for each announcement
    for announcement in announcements:
        if announcement.get("sent") == True:  # Skip if already sent
            logging.info(f"Skipping already sent announcement: {announcement['title']}")
            continue
        
        email_body = generate_email_body(announcement)
        send_email(
            subject=announcement.get("title", "DTE Announcement"),
            body=email_body,
            recipients=recipients
        )

        # After sending the email, update the status in announcements.json
        update_announcement_status(announcement)


if __name__ == "__main__":
    monitor_announcements_and_send_emails()
