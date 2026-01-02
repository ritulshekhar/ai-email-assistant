console.log("POPUP JS LOADED");

// Rewrite buttons
document.querySelectorAll("button[data-tone]").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const tone = btn.dataset.tone;

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });

    chrome.tabs.sendMessage(tab.id, {
      type: "REWRITE_EMAIL",
      tone: tone
    });
  });
});

// Classify button
document.getElementById("classify").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  chrome.tabs.sendMessage(tab.id, {
    type: "CLASSIFY_EMAIL"
  });
});
