chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type !== "REWRITE_EMAIL") return;

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
    .catch(err => {
      console.error("Background fetch failed:", err);
      sendResponse({ success: false });
    });

  // REQUIRED for async response
  return true;
});
