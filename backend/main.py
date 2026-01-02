from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import ollama
import json

app = FastAPI()

# CORS (required for Chrome extension)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ExtractRequest(BaseModel):
    text: str

@app.post("/extract-event")
def extract_event(req: ExtractRequest):
    prompt = f"""
You are an information extraction system.

From the email text below, extract:
- event_type (Interview Scheduled / Meeting / Deadline / None)
- date_text (EXACT words used for date like "tomorrow", "next week", "Jan 4", or "none")
- time (EXACT time if mentioned, else "none")

Return ONLY valid JSON. No explanations.

Email:
{req.text}
"""

    response = ollama.generate(
        model="mistral",
        prompt=prompt
    )

    raw = response["response"].strip()

    try:
        return json.loads(raw)
    except Exception:
        return {
            "event_type": "None",
            "date_text": "none",
            "time": "none"
        }
