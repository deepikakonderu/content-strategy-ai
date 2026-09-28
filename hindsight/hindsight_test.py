import os
from dotenv import load_dotenv
from hindsight_client import Hindsight

# Load environment variables
load_dotenv(override=True)

# Connect to local Hindsight
client = Hindsight(
    base_url=os.getenv("HINDSIGHT_API_URL"),
    api_key=os.getenv("HINDSIGHT_API_KEY")
)

BANK_ID = "contentmind"

# Create memory bank
try:
    bank = client.create_bank(
        bank_id=BANK_ID,
        name="ContentMind"
    )
    print("Memory bank created:", bank.bank_id)
except Exception as e:
    print("Bank may already exist:", e)

# Short content performance memories
posts = [
    "AI Tools post: 12,000 views, 850 likes, 120 comments, 90 shares. Practical AI content performed well.",
    "AI Agents post: 14,000 views, 980 likes, 150 comments, 110 shares. AI agent content performed extremely well.",
    "ML Basics post: 2,000 views, 120 likes, 20 comments, 8 shares. Beginner ML theory had low engagement.",
    "Developer Productivity post: 9,500 views, 700 likes, 85 comments, 65 shares. Practical developer content performed well."
]

# Store memories
for post in posts:
    client.retain(
        bank_id=BANK_ID,
        content=post,
        context="Content performance"
    )

print("\nAll content memories stored successfully!")

# Recall relevant memories
result = client.recall(
    bank_id=BANK_ID,
    query="What type of content performed well?"
)

print("\nRecalled memories:")

for memory in result.results:
    print("-", memory.text)

client.close()
