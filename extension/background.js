chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  // -------- Rewrite --------
  if (request.type === "REWRITE_BACKEND") {
    fetch("http://127.0.0.1:8000/rewrite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: request.text,
        tone: request.tone
      })
    })
    .then(res => res.json())
    .then(data => {
      sendResponse({ success: true, rewritten: data.rewritten_text });
    })
    .catch(() => sendResponse({ success: false }));

    return true;
  }

  // -------- Classify --------
  if (request.type === "CLASSIFY_BACKEND") {
    fetch("http://127.0.0.1:8000/classify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: request.text })
    })
    .then(res => res.json())
    .then(data => {
      sendResponse({ success: true, category: data.category });
    })
    .catch(() => sendResponse({ success: false }));

    return true;
  }

  // -------- Extract --------
  if (request.type === "EXTRACT_BACKEND") {
    fetch("http://127.0.0.1:8000/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: request.text })
    })
    .then(res => res.json())
    .then(data => {
      sendResponse({ success: true, result: JSON.stringify(data, null, 2) });
    })
    .catch(() => sendResponse({ success: false }));

    return true;
  }

});
