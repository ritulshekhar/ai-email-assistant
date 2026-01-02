from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

# ✅ ALLOW CHROME EXTENSION & LOCALHOST
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # safe for local tool
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RewriteRequest(BaseModel):
    text: str
    tone: str

@app.post("/rewrite")
def rewrite_email(req: RewriteRequest):
    prompt = f"""
Rewrite the following email in a {req.tone} tone.
Make it clear, natural, and professional.
Do not add new information.

Email:
{req.text}
"""

    response = requests.post(
        "http://127.0.0.1:11434/api/generate",
        json={
            "model": "mistral",
            "prompt": prompt,
            "stream": False
        },
        timeout=120
    )

    output = response.json()
    rewritten = output.get("response", req.text)

    return {"rewritten_text": rewritten}
