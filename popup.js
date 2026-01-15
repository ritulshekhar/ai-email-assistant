console.log("POPUP JS LOADED");

document.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const action = btn.dataset.action;
    const tone = btn.dataset.tone;
    console.log("Tone selected:", tone);

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    console.log("Sending message to tab:", tab.id);

    // ===== REWRITE EMAIL =====
    if (action === "rewrite") {
      chrome.tabs.sendMessage(
        tab.id,
        {
          type: "REWRITE_EMAIL",
          tone: tone,
        },
        (response) => {
          if (chrome.runtime.lastError) {
            alert("Open Gmail and select email text first.");
            return;
          }
        }
      );
    }

    // ===== EXTRACT EVENT =====
    if (action === "extract") {
      chrome.tabs.sendMessage(
        tab.id,
        {
          type: "EXTRACT_EVENT",
        },
        (response) => {
          if (chrome.runtime.lastError) {
            alert("Open an email to extract events.");
            return;
          }

          if (response && response.data) {
            alert(
              "Extracted Info:\n\n" +
              JSON.stringify(response.data, null, 2)
            );
          }
        }
      );
    }
  });
});
