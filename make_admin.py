from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "privacy_store")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
users_col = db["users"]

username = "manu"
result = users_col.update_one(
    {"username": username},
    {"$set": {"is_admin": True}}
)

if result.matched_count > 0:
    print(f"User '{username}' is now an ADMIN.")
else:
    print(f"User '{username}' not found.")
