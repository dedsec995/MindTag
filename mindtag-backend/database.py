from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME", "mindtag") # Default to 'mindtag_db' if not set

client: AsyncIOMotorClient = None
db = None

async def connect_to_mongo():
    global client, db
    try:
        client = AsyncIOMotorClient(MONGO_URI)
        await client.admin.command('ping') # Test connection
        db = client[DB_NAME]
        print(f"Connected to MongoDB database: {DB_NAME}")
    except Exception as e:
        print(f"Could not connect to MongoDB: {e}")
        # Optionally, re-raise the exception or handle it more gracefully
        raise

async def close_mongo_connection():
    global client
    if client:
        client.close()
        print("MongoDB connection closed.")

def get_database():
    return db