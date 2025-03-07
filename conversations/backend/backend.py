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

# Remove any duplicates
print("Removing duplicates...")
pipeline = [
    {"$group": { 
        "_id": {"hskLevel": "$hskLevel", "topic": "$topic", "conversation": "$conversation"}, 
        "docs": {"$push": "$_id"}
    }}
]

for group in collection.aggregate(pipeline):
    ids_to_delete = group["docs"][1:]  # Keep one, delete the rest
    if ids_to_delete:
        collection.delete_many({"_id": {"$in": ids_to_delete}})

print("Duplicates removed.")


# Read JSON files
folder = "conversations/"
files = [f for f in os.listdir(folder) if f.endswith(".json")]

for file in files:
    hsk_level = file.replace(".json", "").replace("hsk", "")  # Extract HSK level
    with open(os.path.join(folder, file), "r", encoding="utf-8") as f:
        data = json.load(f)
    
    for convo in data:
        convo["hskLevel"] = hsk_level  # Add HSK level to document
        filter_query = {"hskLevel": hsk_level, "topic": convo["topic"]}
        collection.update_one(filter_query, {"$set": convo}, upsert=True)

print("Data inserted/updated successfully!")

# Create index to prevent duplicates
collection.create_index([("hskLevel", 1), ("topic", 1), ("conversation", 1)], unique=True)
print("Unique index created.")
