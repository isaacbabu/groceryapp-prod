import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

async def test():
    print("🔄 Testing MongoDB Atlas connection...")
    try:
        client = AsyncIOMotorClient(os.environ['MONGO_URL'])
        db = client[os.environ['DB_NAME']]
        
        # Ping the database
        await client.admin.command('ping')
        print("✅ Connected to MongoDB Atlas successfully!")
        
        # Test write
        result = await db.test_collection.insert_one({"test": "hello"})
        print(f"✅ Write test passed!")
        
        # Cleanup
        await db.test_collection.delete_one({"test": "hello"})
        print("✅ All tests passed! Ready for Phase 2!")
        
    except Exception as e:
        print(f"❌ Error: {e}")

asyncio.run(test())