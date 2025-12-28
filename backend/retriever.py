import faiss
import json
import numpy as np

index = faiss.read_index("data/index.faiss")

with open("data/metadata.json") as f:
    metadata = json.load(f)

def search(embedding, k=5):
    D, I = index.search(embedding.astype("float32"), k)
    results = []
    for idx, score in zip(I[0], D[0]):
        item = metadata[idx]
        item["score"] = float(score)
        results.append(item)
    return results
