from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Models ----------

class RewriteRequest(BaseModel):
    text: str
    tone: str

class ClassifyRequest(BaseModel):
    text: str

class ExtractRequest(BaseModel):
    text: str


# ---------- Helper ----------

def run_ollama(prompt: str):
    result = subprocess.run(
        ["ollama", "run", "mistral"],
        input=prompt,
        capture_output=True,
        text=True
    )
    return result.stdout.strip()


# ---------- Rewrite ----------

@app.post("/rewrite")
def rewrite_email(req: RewriteRequest):
    prompt = f"""
Rewrite the following email in a {req.tone} tone.
Only return the rewritten email text.

Email:
{req.text}
"""
    rewritten = run_ollama(prompt)
    return {"rewritten_text": rewritten}


# ---------- Classify ----------

@app.post("/classify")
def classify_email(req: ClassifyRequest):
    prompt = f"""
Classify this email into ONE category only:
- Spam
- Promotion
- Interview
- Job Application
- Personal
- Other

Return ONLY the category name.

Email:
{req.text}
"""
    category = run_ollama(prompt)
    return {"category": category}


# ---------- Extract Dates ----------

@app.post("/extract")
def extract_info(req: ExtractRequest):
    prompt = f"""
Extract important events from the email.

Return STRICT JSON only in this format:
{{
  "event_type": "...",
  "date": "...",
  "time": "..."
}}

If nothing important exists, return:
{{"event_type": "none"}}

Email:
{req.text}
"""
    raw = run_ollama(prompt)

    try:
        data = json.loads(raw)
    except:
        data = {"event_type": "parse_error", "raw": raw}

    return data
