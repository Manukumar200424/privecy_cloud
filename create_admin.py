from pymongo import MongoClient
import os
import bcrypt
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "privacy_store")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
users_col = db["users"]

# Admin credentials
username = "manu kumar"
password = "Manu@9900"
email = "admin@privacycloud.com"
fullname = "Manu Kumar"

# Check if user already exists
existing_user = users_col.find_one({"username": username})

if existing_user:
    # Update existing user to admin
    result = users_col.update_one(
        {"username": username},
        {"$set": {"is_admin": True}}
    )
    if result.modified_count > 0:
        print(f"User '{username}' is now an ADMIN.")
    else:
        print(f"User '{username}' is already an ADMIN.")
else:
    # Create new admin user
    # Hash password
    pw_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    # Generate encryption salt for user
    enc_salt = os.urandom(16)
    
    # Create user document
    user_doc = {
        'username': username,
        'password_hash': pw_hash,
        'enc_salt': enc_salt,
        'email': email,
        'fullname': fullname,
        'phone': '',
        'gender': '',
        'dob': '',
        'joined': datetime.utcnow().strftime("%B %Y"),
        'is_admin': True,
        'last_login': None,
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    }
    
    result = users_col.insert_one(user_doc)
    print(f"Admin user '{username}' created successfully!")
    print(f"User ID: {result.inserted_id}")
    print(f"Password: {password}")
    print(f"Email: {email}")

print("\nAdmin Login Information:")
print(f"Username: {username}")
print(f"Password: {password}")
print(f"Login URL: http://127.0.0.1:5000/login")
