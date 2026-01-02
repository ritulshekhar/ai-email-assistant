function getSelectedText() {
  const selection = window.getSelection();
  if (selection && selection.toString().trim()) {
    return selection.toString();
  }

  const activeEl = document.activeElement;
  if (activeEl && activeEl.isContentEditable) {
    return selection.toString();
  }

  return "";
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type !== "REWRITE_EMAIL") return;

  const text = getSelectedText();

  console.log("Captured text:", text);

  if (!text) {
    alert("No text detected. Select text inside the compose box.");
    return;
  }

  alert(
    `Captured successfully\n\nTone: ${request.tone}\n\nText:\n${text}`
  );
});
