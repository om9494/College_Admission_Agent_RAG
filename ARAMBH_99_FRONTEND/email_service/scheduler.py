import time
import schedule
import logging
from web_scraping import scrape_announcements, save_to_json, import_new_users_to_json
from email_sender import monitor_announcements_and_send_emails  # Import email sending function
from datetime import datetime
from email_sender import send_welcome_email



# Logging configuration
logging.basicConfig(
    filename='scheduler.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def job():
    logging.info(f"Job started at {datetime.now()}")
    
    logging.info("importing new user to new_users.json")
    import_new_users_to_json()

    # Scrape the announcements and save them to announcements.json
    announcements = scrape_announcements()
    send_welcome_email()
    if announcements:
        save_to_json(announcements, "announcements.json")
        logging.info("Announcements saved to announcements.json")

        # After saving, trigger the email sending process
        logging.info("Triggering email sending process...")
        monitor_announcements_and_send_emails()  # Run the email sender function
    
    else:
        logging.warning("No new announcements found. Skipping email sending.")

# Schedule the job to run every hour or based on your requirements
schedule.every(10).seconds.do(job)  # You can change the interval here

if __name__ == "__main__":
    print("Scheduler started. Waiting for the next job...")  # Display message in terminal
    logging.info("Scheduler started.")  # Log the start of the scheduler
    
    while True:
        schedule.run_pending()  # Run pending scheduled jobs
        time.sleep(1)  # Sleep for 1 second before checking again