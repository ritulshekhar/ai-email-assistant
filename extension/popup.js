document.querySelectorAll("button").forEach(btn => {
  btn.addEventListener("click", async () => {
    const tone = btn.dataset.tone;

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: rewriteEmail,
      args: [tone]
    });
  });
});

function rewriteEmail(tone) {
  window.postMessage({ type: "REWRITE_EMAIL", tone }, "*");
}
