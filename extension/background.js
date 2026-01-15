chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const actions = {
    REWRITE_EMAIL: {
      url: "http://127.0.0.1:8000/rewrite",
      body: { text: request.text, tone: request.tone }
    },
    EXTRACT_EVENT: {
      url: "http://127.0.0.1:8000/extract-event",
      body: { text: request.text }
    },
    CLASSIFY_EMAIL: {
      url: "http://127.0.0.1:8000/classify",
      body: { text: request.text }
    }
  };

  const action = actions[request.type];
  if (!action) return;

  fetch(action.url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(action.body)
  })
    .then(res => res.json())
    .then(data => {
      sendResponse({ success: true, data: data });
    })
    .catch(err => {
      console.error("Fetch failed:", err);
      sendResponse({ success: false, error: err.message });
    });

  return true; // Keep channel open for async response
});
