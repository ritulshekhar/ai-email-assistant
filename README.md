# AI Email Assistant

AI Email Assistant is a privacy-first Chrome extension that integrates local Large Language Models (LLMs) directly into the Gmail web interface. It enables users to rewrite emails, extract structured event data, and classify messages using local inference to ensure data sovereignty.

---

## Technical Architecture

The extension follows a standard Manifest V3 architecture with a decoupled backend:

1.  **Popup (extension/popup.js)**: Captures user actions and handles UI events. It sends standardized messages (REWRITE_EMAIL, EXTRACT_EVENT, CLASSIFY_EMAIL) to the Content Script.
2.  **Content Script (extension/content.js)**: Executed in the context of Gmail. It handles DOM manipulation for text selection and injection. It bridges the Popup and the Background Service Worker.
3.  **Background Worker (extension/background.js)**: Acts as the network proxy. It listens for messages from the Content Script and executes HTTP POST requests to the local FastAPI backend to bypass CORS and ensure secure connectivity.
4.  **Backend (backend/main.py)**: A FastAPI application that serves as an abstraction layer for the Ollama inference engine, exposing endpoints for inference.

---

## Directory Structure

- **extension/**: Contains the Chrome extension source code. Load this folder as an "unpacked extension" in Chrome.
- **backend/**: Contains the Python application and requirements for the AI service.

---

## Setup and Installation

### Prerequisites
- Python 3.10 or higher.
- Ollama installed and running (default port 11434).
- Mistral model pulled via Ollama.

### Backend Setup
1. Pull the model:
   ```bash
   ollama pull mistral
   ```
2. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
3. Execute the server:
   ```bash
   uvicorn main:app --host 127.0.0.1 --port 8000 --reload
   ```

### Extension Setup
1. Open Chrome and navigate to `chrome://extensions/`.
2. Activate Developer Mode.
3. Select "Load unpacked" and point to the `extension/` directory.

---

## Contributing

We welcome contributions centered on enhancing Gmail DOM selectors for more robust text capture.

### Development Workflow
1.  **Branching**: Create a feature branch from main.
2.  **Logic Changes**: Ensure any changes to message types are reflected in both the `popup.js` and `background.js` handlers.
3.  **Backend Updates**: All new endpoints must be added to `backend/main.py` with corresponding Pydantic models for request validation.

---

## Troubleshooting

- **Connection Refused**: Verify that the FastAPI server is running on port 8000 and Ollama is active on port 11434.
- **Text Capture Failed**: Gmail frequently updates its DOM structure. If the extension fails to grab text, inspect the current Gmail CSS selectors and update `getEmailBody()` in `content.js`.

---

## License
MIT License.
