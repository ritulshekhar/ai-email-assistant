function replaceSelectedText(newText) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  range.deleteContents();
  range.insertNode(document.createTextNode(newText));
}

chrome.runtime.onMessage.addListener((request) => {
  if (request.type !== "REWRITE_EMAIL") return;

  const selection = window.getSelection();
  const selectedText = selection.toString();

  if (!selectedText) {
    alert("Please select text inside the Gmail compose box.");
    return;
  }

  chrome.runtime.sendMessage(
    {
      type: "REWRITE_EMAIL",
      text: selectedText,
      tone: request.tone
    },
    (response) => {
      if (!response || !response.success) {
        alert("AI rewrite failed. Backend not reachable.");
        return;
      }
      replaceSelectedText(response.rewritten);
    }
  );
});
