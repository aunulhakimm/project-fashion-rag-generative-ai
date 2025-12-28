from gradio_client import Client
import json

COLAB_URL = "https://9ba1a43adfdd560614.gradio.live"

client = Client(COLAB_URL)

def call_llama_rag(query, items):
    try:
        result = client.predict(
            query,
            json.dumps(items),
            api_name="/predict"
        )
    except Exception:
        return None

    # normalize gradio output
    if isinstance(result, list):
        result = result[0]

    # sanitize remote errors that come back as strings
    if isinstance(result, str):
        up = result.upper()
        if "TRACEBACK" in up or "ERROR" in up or "EXCEPTION" in up:
            return None

    return result
