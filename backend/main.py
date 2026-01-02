from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import ollama

app = FastAPI()

# 🔹 CORS FIX (CRITICAL)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow chrome-extension://
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RewriteRequest(BaseModel):
    text: str
    tone: str


class ClassifyRequest(BaseModel):
    text: str


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


@app.post("/classify")
def classify_email(req: ClassifyRequest):
    try:
        prompt = f"""
Classify the following email into ONE of these categories only:
- Spam
- Promotion
- Important
- Personal
- Job

Email:
{req.text}

Return ONLY the category name.
"""

        response = ollama.generate(
            model="mistral:latest",
            prompt=prompt
        )

        return {
            "category": response["response"].strip()
        }

    except Exception as e:
        return {
            "category": f"Error: {str(e)}"
        }
