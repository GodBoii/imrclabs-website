from flask import Flask, request, jsonify
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration for email sending
EMAIL_ADDRESS = "imrc.analysis@yahoo.in"  # Replace with actual email
EMAIL_PASSWORD = os.environ.get("EMAIL_PASSWORD", "")  # Get from environment variable for security
SMTP_SERVER = "smtp.mail.yahoo.com"
SMTP_PORT = 587

@app.route('/api/contact', methods=['POST'])
def handle_contact_form():
    """Handle the contact form submission and send an email"""
    data = request.json
    
    if not data:
        return jsonify({"status": "error", "message": "No data provided"}), 400
    
    # Extract form fields
    name = data.get('name', '')
    email = data.get('email', '')
    phone = data.get('phone', '')
    subject = data.get('subject', 'New Contact Form Submission')
    message = data.get('message', '')
    
    # Validate required fields
    if not all([name, email, message]):
        return jsonify({
            "status": "error", 
            "message": "Please provide name, email, and message"
        }), 400
    
    try:
        # Create email
        msg = MIMEMultipart()
        msg['From'] = EMAIL_ADDRESS
        msg['To'] = EMAIL_ADDRESS  # Sending to ourselves
        msg['Subject'] = f"IMRC Website: {subject}"
        
        # Create email body
        email_body = f"""
        You have received a new message from the IMRC website:
        
        Name: {name}
        Email: {email}
        Phone: {phone}
        
        Message:
        {message}
        """
        
        msg.attach(MIMEText(email_body, 'plain'))
        
        # Send email if password is configured
        if EMAIL_PASSWORD:
            server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
            server.starttls()
            server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            server.send_message(msg)
            server.quit()
            
            return jsonify({"status": "success", "message": "Your message has been sent!"}), 200
        else:
            # For development or if email is not configured
            print("Email would be sent (if configured):")
            print(email_body)
            return jsonify({
                "status": "success", 
                "message": "Your message has been received (Development Mode)"
            }), 200
            
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return jsonify({
            "status": "error", 
            "message": "There was an error sending your message. Please try again later."
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({"status": "ok"}), 200

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
