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

class RewriteRequest(BaseModel):
    text: str
    tone: str

class ExtractRequest(BaseModel):
    text: str

class ClassifyRequest(BaseModel):
    text: str

@app.post("/rewrite")
def rewrite_email(req: RewriteRequest):
    try:
        prompt = f"Rewrite this email in a {req.tone} tone:\n\n{req.text}"
        response = ollama.generate(model="mistral", prompt=prompt)
        return {"rewritten_text": response["response"]}
    except Exception as e:
        return {"rewritten_text": f"(Error from backend: {str(e)})"}

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
    try:
        response = ollama.generate(model="mistral", prompt=prompt)
        raw = response["response"].strip()
        # Handle cases where model might wrap JSON in backticks
        if "```json" in raw:
            raw = raw.split("```json")[1].split("```")[0].strip()
        elif "```" in raw:
            raw = raw.split("```")[1].split("```")[0].strip()
        return json.loads(raw)
    except Exception:
        return {
            "event_type": "None",
            "date_text": "none",
            "time": "none"
        }

@app.post("/classify")
def classify_email(req: ClassifyRequest):
    prompt = f"""
Classify this email into one of these categories: Job/Interview, Promotions, Personal, Updates, Spam.
Return ONLY the category name.

Email:
{req.text}
"""
    try:
        response = ollama.generate(model="mistral", prompt=prompt)
        category = response["response"].strip()
        return {"category": category}
    except Exception as e:
        return {"category": "Unknown"}
