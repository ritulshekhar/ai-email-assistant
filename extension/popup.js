document.querySelectorAll("button").forEach(btn => {
  btn.addEventListener("click", async () => {

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });

    if (btn.dataset.tone) {
      chrome.tabs.sendMessage(tab.id, {
        type: "REWRITE_EMAIL",
        tone: btn.dataset.tone
      });
    }

    if (btn.dataset.action === "extract") {
      chrome.tabs.sendMessage(tab.id, {
        type: "EXTRACT_EMAIL"
      });
    }

    if (btn.dataset.action === "classify") {
      chrome.tabs.sendMessage(tab.id, {
        type: "CLASSIFY_EMAIL"
      });
    }

  });
});
