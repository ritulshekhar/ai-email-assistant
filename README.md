# AI Email Assistant (Chrome Extension)

AI Email Assistant is a privacy-first Chrome extension that leverages local LLMs to enhance your Gmail productivity. Rewrite emails, classify incoming messages, and extract key event details—all without your data ever leaving your machine.

---

## Features

- **Context-Aware Rewriting**: Instantly rewrite selected text in multiple tones (Formal, Polite, Confident, etc.).
- **Email Classification**: Automatically categorize emails into Job/Interview, Promotions, Personal, and more.
- **Structured Information Extraction**: Extract interview dates, times, and context directly from email bodies.
- **Privacy by Design**: Powered by [Ollama](https://ollama.com/), ensuring all AI inference happens locally.

---

## Tech Stack

- **Extension**: Manifest V3, JavaScript (Content Scripts + Service Workers)
- **Backend**: FastAPI (Python 3.10+)
- **AI Engine**: Ollama (Mistral model)
- **Integration**: Gmail Web UI

---

## Setup and Installation

### 1. Prerequisites
- [Ollama](https://ollama.com/) installed and running.
- Python 3.10+ installed.

### 2. Backend Configuration
1. Pull the required model:
   ```bash
   ollama pull mistral
   ```
2. Navigate to the backend directory and install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the FastAPI server:
   ```bash
   uvicorn main:app --host 127.0.0.1 --port 8000 --reload
   ```

### 3. Extension Installation
1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** in the top right corner.
3. Click **Load unpacked** and select the root directory of this project.

---

## Usage

1. **Rewriting**: Open a Gmail compose window, select the text you want to change, and click a tone button in the extension popup.
2. **Extraction and Classification**: Open an existing email and click the respective buttons in the popup to view analyzed data.

---

## Troubleshooting

- **Ollama Connection Error**: Ensure the Ollama service is running and accessible at `localhost:11434`.
- **Extension not responding**: Reload the extension in `chrome://extensions/` and refresh your Gmail tab.
- **CORS Issues**: The FastAPI backend is configured to allow `*` origins for local development; ensure no firewall is blocking port `8000`.

---

## License
MIT License. Free to use and modify.
