#!/usr/bin/env python3
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from datetime import datetime, timezone, timedelta
import uuid

load_dotenv('backend/.env')

async def create_test_session():
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    # Create a test user
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    session_token = f"test_session_{uuid.uuid4().hex[:12]}"
    
    user_doc = {
        "user_id": user_id,
        "email": "test@example.com",
        "name": "Test User",
        "picture": None,
        "phone_number": "+1234567890",
        "home_address": "123 Test Street",
        "is_admin": False,
        "created_at": datetime.now(timezone.utc)
    }
    
    session_doc = {
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": datetime.now(timezone.utc) + timedelta(days=7),
        "created_at": datetime.now(timezone.utc)
    }
    
    # Insert user and session
    await db.users.insert_one(user_doc)
    await db.user_sessions.insert_one(session_doc)
    
    print(f"Created test user: {user_id}")
    print(f"Created test session: {session_token}")
    
    client.close()
    return session_token

if __name__ == "__main__":
    token = asyncio.run(create_test_session())
    print(f"Use this token for testing: {token}")