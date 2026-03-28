from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "privacy_store")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
users_col = db["users"]

print("List of Users:")
for user in users_col.find():
    print(f"- '{user.get('username')}' (ID: {user.get('_id')})")
