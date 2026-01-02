from fastapi import FastAPI
from pydantic import BaseModel
import ollama

app = FastAPI()


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
