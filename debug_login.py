#!/usr/bin/env python3
"""
Debug script to test login functionality
"""
import os
import bcrypt
import sys
from pymongo import MongoClient

# Configuration
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017')
DB_NAME = os.getenv('DB_NAME', 'privacy_store')

def debug_login():
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    users_col = db['users']
    
    print("=== Login Debug Tool ===")
    print("Available users:")
    
    # List all users
    users = list(users_col.find({}))
    for i, user in enumerate(users, 1):
        print(f"{i}. Username: '{user.get('username', 'N/A')}' (Admin: {user.get('is_admin', False)})")
    
    if not users:
        print("No users found in database!")
        return
    
    # Test login for each user
    print("\n=== Testing Login ===")
    for user in users:
        username = user.get('username')
        stored_hash = user.get('password_hash')
        
        print(f"\nTesting user: '{username}'")
        print(f"Hash type: {type(stored_hash)}")
        print(f"Hash length: {len(stored_hash)}")
        
        # Test with common passwords
        test_passwords = ['password', 'password123', '123456', username, 'admin']
        
        for test_pwd in test_passwords:
            try:
                if bcrypt.checkpw(test_pwd.encode(), stored_hash):
                    print(f"SUCCESS: Password is '{test_pwd}'")
                    break
            except Exception as e:
                print(f"Error testing '{test_pwd}': {e}")
        else:
            print("No common passwords matched")
    
    # Create a test user with known password
    print("\n=== Creating Test User ===")
    test_username = "testuser"
    test_password = "testpass123"
    
    # Check if test user exists
    if users_col.find_one({"username": test_username}):
        print(f"Test user '{test_username}' already exists")
    else:
        # Create new test user
        pw_hash = bcrypt.hashpw(test_password.encode(), bcrypt.gensalt())
        enc_salt = os.urandom(16)
        
        test_user = {
            "username": test_username,
            "password_hash": pw_hash,
            "enc_salt": enc_salt,
            "email": "test@example.com",
            "fullname": "Test User",
            "is_admin": False,
            "created_at": "2024-01-01"
        }
        
        try:
            users_col.insert_one(test_user)
            print(f"Created test user:")
            print(f"   Username: {test_username}")
            print(f"   Password: {test_password}")
            print(f"   You can now login with these credentials")
        except Exception as e:
            print(f"Error creating test user: {e}")

if __name__ == "__main__":
    debug_login()
