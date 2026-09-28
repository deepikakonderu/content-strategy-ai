import json

from agent import generate_strategy
from sample_data import SAMPLE_POSTS, SAMPLE_MEMORIES


result = generate_strategy(
    posts=SAMPLE_POSTS,
    memories=SAMPLE_MEMORIES
)

print("\n===== AI GENERATED STRATEGY =====")
print(json.dumps(result, indent=4))