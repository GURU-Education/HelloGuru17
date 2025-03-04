import json
import os
from pymongo import MongoClient
from dotenv import load_dotenv  # Load .env file

# Load environment variables
load_dotenv()

# Connect to MongoDB Atlas
mongo_uri = os.getenv("MONGO_URI")

client = MongoClient(mongo_uri)

db = client["HelloGuru"] 
collection = db["conversations"] 

# Read JSON files
folder = "conversations/"
files = [f for f in os.listdir(folder) if f.endswith(".json")]

for file in files:
    hsk_level = file.replace(".json", "").replace("hsk", "")  # Extract HSK level
    with open(os.path.join(folder, file), "r", encoding="utf-8") as f:
        data = json.load(f)
    
    for convo in data:
        convo["hsk-level"] = hsk_level  # Add HSK level to document
        filter_query = {"hsk-level": hsk_level, "topic": convo["topic"]}
        collection.update_one(filter_query, {"$set": convo}, upsert=True)

print("Data inserted/updated successfully!")
