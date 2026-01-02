console.log("POPUP LOADED");

document.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const tone = btn.dataset.tone;

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });

    if (!tab || !tab.id) {
      alert("No active tab found.");
      return;
    }

    chrome.tabs.sendMessage(
      tab.id,
      { type: "CLASSIFY_EMAIL" },
      (response) => {
        if (chrome.runtime.lastError) {
          console.warn("No content script yet.");
          alert("Please refresh Gmail and try again.");
        }
      }
    );
  });
});
