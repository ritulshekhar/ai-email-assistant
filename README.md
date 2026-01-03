# AI Email Assistant (Chrome Extension)

AI Email Assistant is a Chrome extension that enhances Gmail productivity using local AI. It allows users to rewrite emails in multiple tones, classify emails into meaningful categories, and extract important details such as interview dates and times — all without sending data to third-party cloud APIs.

The project is designed to be privacy-first, fast, and practical for everyday use.

---

## Features

### Email Rewriting
Rewrite selected email text directly inside Gmail using four tones:
- Formal
- Confident
- Short & Crisp
- Informal

The rewritten text replaces the selected content in place, with no page reloads.

---

### Email Classification
Classifies emails into useful categories such as:
- Job / Interview
- Promotions
- Personal
- Updates
- Spam

The category is displayed as a badge near the email subject inside Gmail.

---

### Interview & Meeting Detail Extraction
Extracts structured information from emails, including:
- Date
- Time
- Context (interview, meeting, call, etc.)

Useful for identifying interview schedules and important events directly from emails.

---

### Privacy-First AI
- Uses a locally running LLM (via Ollama)
- No OpenAI or paid APIs
- No email data leaves the user’s machine
- Fully free to use and share

---

## Tech Stack

- Chrome Extension (Manifest V3)
- JavaScript (Popup + Content Scripts)
- FastAPI (Python backend)
- Ollama (local LLM inference)
- Gmail Web UI integration

---

## How It Works

1. The Chrome extension injects a content script into Gmail.
2. User actions from the popup (rewrite, classify, extract) are sent to the content script.
3. The content script sends the email content to a local FastAPI backend.
4. The backend processes the request using a local LLM and returns the result.
5. The content script updates the Gmail UI in real time.

---

## Running the Project Locally

### Backend
1. Install Ollama and pull a model (for example, mistral).
2. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
