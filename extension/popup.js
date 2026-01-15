console.log("POPUP JS LOADED");

document.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const action = btn.dataset.action;
    const tone = btn.dataset.tone;

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab || !tab.id) {
      alert("No active tab found.");
      return;
    }

    // ===== REWRITE EMAIL =====
    if (action === "rewrite") {
      chrome.tabs.sendMessage(
        tab.id,
        { type: "REWRITE_EMAIL", tone: tone },
        (response) => {
          if (chrome.runtime.lastError) {
            alert("Select text in Gmail compose box first.");
          }
        }
      );
    }

    // ===== EXTRACT EVENT =====
    if (action === "extract") {
      chrome.tabs.sendMessage(
        tab.id,
        { type: "EXTRACT_EVENT" },
        (response) => {
          if (chrome.runtime.lastError) {
            alert("Open an email top extract events.");
            return;
          }
          if (response && response.data) {
            alert("Extracted Info:\n\n" + JSON.stringify(response.data, null, 2));
          }
        }
      );
    }

    // ===== CLASSIFY EMAIL =====
    if (action === "classify") {
      chrome.tabs.sendMessage(
        tab.id,
        { type: "CLASSIFY_EMAIL" },
        (response) => {
          if (chrome.runtime.lastError) {
            alert("Open an email to classify.");
            return;
          }
          if (response && response.data) {
            alert("Email Category: " + response.data.category);
          }
        }
      );
    }
  });
});
