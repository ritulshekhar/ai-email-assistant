from fastapi import FastAPI
from pydantic import BaseModel
import requests

app = FastAPI()

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
        "http://localhost:11434/api/generate",
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
