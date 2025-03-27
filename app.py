from flask import Flask, render_template, request, jsonify, session, redirect, url_for, send_from_directory
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId
from functools import wraps
import os
import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', os.urandom(24))  # Use environment variable or generate
app.config['UPLOAD_FOLDER'] = 'static/uploads' # Folder for storing the images
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True) # creates directory

# MongoDB Configuration
MONGO_URI = os.environ.get("MONGO_URI") # Get MongoDB URI from .env
client = MongoClient(MONGO_URI)
db = client.imrclabs_db  # Replace with your database name

# --- Authentication Decorator (Middleware) ---
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('admin_logged_in'):
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

# --- Authentication Routes ---
@app.route('/admin/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        if not email or not password:
            return jsonify({'status': 'error', 'message': 'Email and password are required'}), 400

        user = db.admins.find_one({'email': email})

        if user and check_password_hash(user['password'], password):
            session['admin_logged_in'] = True
            session['admin_email'] = email  # Store email in session
            return jsonify({'status': 'success', 'message': 'Login successful'})
        else:
            return jsonify({'status': 'error', 'message': 'Invalid email or password'}), 401

    return render_template('admin/login.html')

@app.route('/admin/logout')
@login_required
def logout():
    session.pop('admin_logged_in', None)
    session.pop('admin_email', None)
    return redirect(url_for('login'))

# --- Dashboard Route ---
@app.route('/admin/dashboard')
@login_required
def admin_dashboard():
    # Example of passing data to the template
    admin_email = session.get('admin_email', 'Admin')
    return render_template('admin/dashboard.html', admin_email=admin_email)

# --- API Endpoints (Projects) ---

@app.route('/api/projects', methods=['GET'])
def get_projects():
    projects = list(db.projects.find())
    for project in projects:
        project['_id'] = str(project['_id'])
    return jsonify(projects)

@app.route('/api/projects', methods=['POST'])
@login_required
def add_project():
    try:
        project_data = request.form.to_dict() # Use to_dict() to get form data
        if not project_data or not project_data.get('name') or not project_data.get('client') or not project_data.get('year') or not project_data.get('description'):
            return jsonify({'status': 'error', 'message': 'Missing required fields'}), 400
        
        #Handle image upload
        if 'image' in request.files:
            file = request.files['image']
            if file.filename != '': #Check if file is uploaded
                filename = secure_filename(file.filename) # sanitize filename
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                project_data['image'] = '/' + filepath #store relative path

        result = db.projects.insert_one(project_data)
        return jsonify({'status': 'success', 'message': 'Project added', 'id': str(result.inserted_id)}), 201

    except Exception as e:
        print(f"Error adding project: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500


@app.route('/api/projects/<project_id>', methods=['DELETE'])
@login_required
def delete_project(project_id):
    try:
        result = db.projects.delete_one({'_id': ObjectId(project_id)})
        if result.deleted_count == 1:
            return jsonify({'status': 'success', 'message': 'Project deleted'})
        else:
            return jsonify({'status': 'error', 'message': 'Project not found'}), 404
    except Exception as e:
        print(f"Error deleting project: {e}")
        return jsonify({'status': 'error', 'message': 'Failed to delete project'}), 500

# --- API Endpoints (Clients) ---
# Similar structure to Projects (GET, POST, DELETE)
@app.route('/api/clients', methods=['GET'])
def get_clients():
    clients = list(db.clients.find())
    for client in clients:
        client['_id'] = str(client['_id'])  # Convert ObjectId to string
    return jsonify(clients)

@app.route('/api/clients', methods=['POST'])
@login_required
def add_client():
    try:
        client_data = request.form.to_dict() # Use to_dict() to get form data
        # Basic validation (you'll want to add more robust validation)
        if not client_data or not client_data.get('name') :
            return jsonify({'status': 'error', 'message': 'Missing required fields'}), 400
        
        #Handle image upload
        if 'logo' in request.files:
            file = request.files['logo']
            if file.filename != '': #Check if file is uploaded
                filename = secure_filename(file.filename) # sanitize filename
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                client_data['logo'] = '/' + filepath #store relative path
        # Insert the project into MongoDB
        result = db.clients.insert_one(client_data)

        # Return the new project's ID
        return jsonify({'status': 'success', 'message': 'Client added', 'id': str(result.inserted_id)}), 201  # 201 Created

    except Exception as e:
        print(f"Error adding client: {e}")  # Log the error
        return jsonify({'status': 'error', 'message': 'Failed to add client'}), 500

@app.route('/api/clients/<client_id>', methods=['DELETE'])
@login_required
def delete_client(client_id):
    try:
        from bson import ObjectId  # Import ObjectId here
        result = db.clients.delete_one({'_id': ObjectId(client_id)})
        if result.deleted_count == 1:
            return jsonify({'status': 'success', 'message': 'Client deleted'})
        else:
            return jsonify({'status': 'error', 'message': 'Client not found'}), 404  # 404 Not Found
    except Exception as e:
         print(f"Error deleting Client: {e}")  # Log the error for debugging
         return jsonify({'status': 'error', 'message': 'Failed to delete client'}), 500

# --- API Endpoints (Certificates) ---
# Similar structure to Projects (GET, POST, DELETE)
@app.route('/api/certificates', methods=['GET'])
def get_certificates():
    certificates = list(db.certificates.find())
    for certificate in certificates:
        certificate['_id'] = str(certificate['_id'])  # Convert ObjectId to string
    return jsonify(certificates)

@app.route('/api/certificates', methods=['POST'])
@login_required
def add_certificate():
    try:
        certificate_data = request.form.to_dict()
        # Basic validation (you'll want to add more robust validation)
        if not certificate_data or not certificate_data.get('name') or not certificate_data.get('description') :
            return jsonify({'status': 'error', 'message': 'Missing required fields'}), 400

        #Handle image upload
        if 'image' in request.files:
            file = request.files['image']
            if file.filename != '': #Check if file is uploaded
                filename = secure_filename(file.filename) # sanitize filename
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                certificate_data['image'] = '/' + filepath #store relative path
        # Insert the project into MongoDB
        result = db.certificates.insert_one(certificate_data)
        # Return the new project's ID
        return jsonify({'status': 'success', 'message': 'Certificate added', 'id': str(result.inserted_id)}), 201  # 201 Created

    except Exception as e:
        print(f"Error adding certificate: {e}")  # Log the error
        return jsonify({'status': 'error', 'message': 'Failed to add certificate'}), 500
        
@app.route('/api/certificates/<certificate_id>', methods=['DELETE'])
@login_required
def delete_certificate(certificate_id):
    try:
        from bson import ObjectId  # Import ObjectId here
        result = db.certificates.delete_one({'_id': ObjectId(certificate_id)})

        if result.deleted_count == 1:
            return jsonify({'status': 'success', 'message': 'Certificate deleted'})
        else:
            return jsonify({'status': 'error', 'message': 'Certificate not found'}), 404  # 404 Not Found
    except Exception as e:
         print(f"Error deleting certificate: {e}")  # Log the error for debugging
         return jsonify({'status': 'error', 'message': 'Failed to delete certificate'}), 500
# --- API Endpoints (Messages) ---
# Similar structure to Projects (GET, PUT for marking read, DELETE)
@app.route('/api/messages', methods=['GET'])
@login_required
def get_messages():
    messages = list(db.messages.find())
    for message in messages:
        message['_id'] = str(message['_id'])  # Convert ObjectId to string
    return jsonify(messages)

@app.route('/api/messages/<message_id>', methods=['PUT'])
@login_required
def update_message(message_id):
    try:
        from bson import ObjectId  # Import ObjectId here
        update_data = request.get_json()

        if not update_data:
            return jsonify({'status': 'error', 'message': 'No update data provided'}), 400

        result = db.messages.update_one(
            {'_id': ObjectId(message_id)},
            {'$set': update_data}
        )

        if result.modified_count == 1:
            return jsonify({'status': 'success', 'message': 'Message updated'})
        else:
            return jsonify({'status': 'error', 'message': 'Message not found or no changes made'}), 404

    except Exception as e:
        print(f"Error updating message: {e}")
        return jsonify({'status': 'error', 'message': 'Failed to update message'}), 500

@app.route('/api/messages/<message_id>', methods=['DELETE'])
@login_required
def delete_message(message_id):
    try:
        from bson import ObjectId  # Import ObjectId here
        result = db.messages.delete_one({'_id': ObjectId(message_id)})

        if result.deleted_count == 1:
            return jsonify({'status': 'success', 'message': 'Message deleted'})
        else:
            return jsonify({'status': 'error', 'message': 'Message not found'}), 404
    except Exception as e:
        print(f"Error deleting message: {e}")
        return jsonify({'status': 'error', 'message': 'Failed to delete message'}), 500
        
# --- Contact Form Submission ---

@app.route('/api/contact', methods=['POST'])
def contact():
    try:
        data = request.form.to_dict()

        # Validate required fields (using form data now)
        required_fields = ['fullName', 'email', 'subject', 'message']
        if not all(field in data and data[field].strip() for field in required_fields):
            return jsonify({'status': 'error', 'message': 'Please fill in all required fields'}), 400

        # Email validation (using a library for more robustness)
        from email_validator import validate_email, EmailNotValidError
        try:
            validate_email(data['email']).email
        except EmailNotValidError:
            return jsonify({'status': 'error', 'message': 'Invalid email address'}), 400

        # Add date and read status
        data['date'] = datetime.datetime.now().isoformat()
        data['read'] = False

        # Insert the message into MongoDB
        result = db.messages.insert_one(data)
        message_id = str(result.inserted_id)

        # --- Email sending logic ---
        ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL") # get from env
        SMTP_SERVER = os.environ.get("SMTP_SERVER") # get from env
        SMTP_PORT = int(os.environ.get("SMTP_PORT", 587))  # Default to 587 if not set
        SMTP_USERNAME = os.environ.get("SMTP_USERNAME")  # Replace with your email
        SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD") # get from env

        msg = MIMEMultipart()
        msg['From'] = SMTP_USERNAME
        msg['To'] = ADMIN_EMAIL
        msg['Subject'] = f"IMRC Labs Website Contact: {data['subject']}"

        body = f"""
        New contact form submission from the IMRC Labs website:

        Name: {data['fullName']}
        Email: {data['email']}
        Phone: {data.get('phone', 'Not provided')}
        Subject: {data['subject']}

        Message:
        {data['message']}

        This message was submitted on {data['date']}
        """

        msg.attach(MIMEText(body, 'plain'))

        try:
            with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
                server.starttls()
                server.login(SMTP_USERNAME, SMTP_PASSWORD)
                server.sendmail(SMTP_USERNAME, ADMIN_EMAIL, msg.as_string())

            return jsonify({'status': 'success', 'message': "Thank you for your message!", 'id': message_id}), 201

        except Exception as email_err:
            print(f"Error sending email: {email_err}")
            return jsonify({'status': 'success', 'message': "Message received, but email failed.", 'id': message_id}), 201


    except Exception as e:
        print(f"Error processing contact form: {e}")
        return jsonify({'status': 'error', 'message': 'An unexpected error occurred'}), 500



# --- Route for serving static files ---
@app.route('/static/<path:path>')
def static_files(path):
    return send_from_directory('static', path)

# --- Default Route (Serve index.html) ---
@app.route('/')
def index():
    return render_template('index.html')

# --- Routes for Other HTML Pages ---
@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/services')
def services():
    return render_template('services.html')

@app.route('/services/<service_name>')
def service_detail(service_name):
    return render_template(f'services/{service_name}.html')

@app.route('/projects')
def projects():
    return render_template('projects.html')

@app.route('/clients')
def clients():
    return render_template('clients.html')

@app.route('/certificates')
def certificates():
    return render_template('certificates.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

# --- Initial Admin User Creation (Run Once) ---

def create_initial_admin():
    """Creates an initial admin user if none exists."""
    if not db.admins.find_one():
        hashed_password = generate_password_hash("your_initial_password") #CHANGE THIS
        admin_data = {
            'email': 'prajwalghadge2005@gmail.com',  #REPLACE THIS
            'password': hashed_password
        }
        db.admins.insert_one(admin_data)
        print("Initial admin user created.")
    else:
      print("Admin user already exists")

if __name__ == '__main__':
    create_initial_admin()
    app.run(debug=True, port=int(os.environ.get('PORT', 5000))) # Use port from environment or default