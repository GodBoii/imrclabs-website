#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Contact Form Handler for IMRC Labs Website

This script processes contact form submissions from the website
and sends email notifications to the company.

Note: This is a simple implementation for demonstration purposes.
In production, you would need proper security measures, form validation,
and error handling.
"""

import os
import sys
import cgi
import cgitb
import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import datetime

# Enable error tracking for debugging
cgitb.enable()

# Configuration
ADMIN_EMAIL = "prajwalghadge2005@gmail.com"  # Email to receive contact form submissions
SMTP_SERVER = "smtp.gmail.com"  # Replace with your actual SMTP server
SMTP_PORT = 587  # Standard TLS port
SMTP_USERNAME = "your_email@gmail.com"  # Replace with your email
SMTP_PASSWORD = "your_app_password"  # Replace with your app password/token

def send_response(status, message):
    """Send a JSON response back to the client"""
    response = {
        "status": status,
        "message": message
    }
    
    # Set proper headers for JSON response
    print("Content-Type: application/json")
    print()  # Empty line needed between headers and content
    print(json.dumps(response))

def validate_form(form_data):
    """Validate the contact form fields"""
    required_fields = ["fullName", "email", "subject", "message"]
    
    for field in required_fields:
        if field not in form_data or not form_data[field].value:
            return False, f"Field '{field}' is required."
    
    # Simple email validation
    email = form_data["email"].value
    if "@" not in email or "." not in email:
        return False, "Please enter a valid email address."
    
    return True, "Validation successful"

def send_email(form_data):
    """Send an email with the contact form information"""
    try:
        msg = MIMEMultipart()
        msg['From'] = SMTP_USERNAME
        msg['To'] = ADMIN_EMAIL
        msg['Subject'] = f"IMRC Labs Website Contact: {form_data['subject'].value}"
        
        # Build email body
        body = f"""
        New contact form submission from the IMRC Labs website:
        
        Name: {form_data['fullName'].value}
        Email: {form_data['email'].value}
        Phone: {form_data.getvalue('phone', 'Not provided')}
        Subject: {form_data['subject'].value}
        
        Message:
        {form_data['message'].value}
        
        This message was submitted on {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        # Connect to SMTP server and send email
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        text = msg.as_string()
        server.sendmail(SMTP_USERNAME, ADMIN_EMAIL, text)
        server.quit()
        
        return True, "Email sent successfully"
    except Exception as e:
        return False, f"Failed to send email: {str(e)}"

def main():
    """Main function to process the contact form submission"""
    # Get form data
    form = cgi.FieldStorage()
    
    # Validate form data
    valid, message = validate_form(form)
    if not valid:
        send_response("error", message)
        return
    
    # Send email notification
    email_sent, email_message = send_email(form)
    if not email_sent:
        send_response("error", email_message)
        return
    
    # If everything was successful
    send_response("success", "Thank you for your message! We'll get back to you soon.")

if __name__ == "__main__":
    main() 