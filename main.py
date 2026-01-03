import ollama
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
    try:
        prompt = f"Rewrite this email in a {req.tone} tone:\n\n{req.text}"

        response = ollama.generate(
            model="mistral:latest",
            prompt=prompt
        )

        return {
            "rewritten_text": response["response"]
        }

    except Exception as e:
        return {
            "rewritten_text": f"(Error from backend: {str(e)})"
        }
