chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type !== "REWRITE_EMAIL") return;

  fetch("http://127.0.0.1:8000/rewrite", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text: request.text,
      tone: request.tone
    })
  })
    .then(async (res) => {
      // Read raw response first (important)
      const raw = await res.text();
      console.log("RAW BACKEND RESPONSE:", raw);

      // Parse JSON safely
      return JSON.parse(raw);
    })
    .then((data) => {
      // Must match FastAPI response key
      sendResponse({
        success: true,
        rewritten: data.rewritten_text
      });
    })
    .catch((err) => {
      console.error("Background fetch failed:", err);
      sendResponse({ success: false });
    });

  // REQUIRED for async sendResponse
  return true;
});
