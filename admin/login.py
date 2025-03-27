#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Admin Login Script for IMRC Labs Website

This script handles authentication for the admin panel.
Currently a simple implementation for demonstration purposes.
In production, this would use proper security measures like hashing passwords,
CSRF protection, and secure session management.
"""

import json
import os
import sys
import cgi
import cgitb
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib
import time

# Enable error tracking for debugging
cgitb.enable()

# Admin credentials - In production, this would be in a secure database
# with properly hashed passwords and not in plain text
ADMIN_CREDENTIALS = {
    "email": "prajwalghadge2005@gmail.com",
    "password": "prajwalsuhasghadge"
}

def send_response(status, message, data=None):
    """Send a JSON response back to the client"""
    response = {
        "status": status,
        "message": message
    }
    
    if data:
        response["data"] = data
    
    # Set proper headers for JSON response
    print("Content-Type: application/json")
    print()  # Empty line needed between headers and content
    print(json.dumps(response))

def handle_login():
    """Process login request and validate credentials"""
    form = cgi.FieldStorage()
    
    # Get input credentials
    email = form.getvalue("email", "")
    password = form.getvalue("password", "")
    
    # Simple validation
    if not email or not password:
        send_response("error", "Email and password are required")
        return
    
    # Check credentials
    if (email == ADMIN_CREDENTIALS["email"] and 
        password == ADMIN_CREDENTIALS["password"]):
        
        # In a real application, you would generate a secure token here
        # and set it as a secure, httpOnly cookie with proper expiration
        session_token = str(int(time.time()))  # Simple timestamp as token
        
        send_response("success", "Login successful", {
            "token": session_token,
            "email": email
        })
    else:
        # Security best practice: don't specify which field is incorrect
        send_response("error", "Invalid email or password")

def handle_logout():
    """Process logout request"""
    # In a real application, you would invalidate the token
    # and clear the session cookie
    send_response("success", "Logout successful")

def main():
    """Main entry point for the script"""
    # Get the request method and action
    form = cgi.FieldStorage()
    action = form.getvalue("action", "")
    
    if action == "login":
        handle_login()
    elif action == "logout":
        handle_logout()
    else:
        send_response("error", "Invalid action")

if __name__ == "__main__":
    main() 