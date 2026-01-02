console.log("POPUP JS LOADED");

document.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("click", async () => {
    console.log("BUTTON CLICKED");

    const tone = btn.dataset.tone;
    console.log("Tone selected:", tone);

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });

    console.log("Sending message to tab:", tab.id);

    chrome.tabs.sendMessage(tab.id, {
      type: "REWRITE_EMAIL",
      tone: tone
    });
  });
});
