function replaceSelectedText(newText) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  range.deleteContents();
  range.insertNode(document.createTextNode(newText));
}

function getEmailBody() {
  // Gmail specific selector for the email body in read mode or compose mode
  const body = document.querySelector('.ii.gt') || document.querySelector('[role="textbox"]');
  return body ? body.innerText : "";
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "REWRITE_EMAIL") {
    const selection = window.getSelection();
    const selectedText = selection.toString();

    if (!selectedText) {
      alert("Please select text inside the Gmail compose box.");
      return;
    }

    chrome.runtime.sendMessage(
      { type: "REWRITE_EMAIL", text: selectedText, tone: request.tone },
      (response) => {
        if (response && response.success) {
          replaceSelectedText(response.data.rewritten_text || response.data.rewritten);
        } else {
          alert("AI rewrite failed. Backend not reachable.");
        }
      }
    );
  }

  if (request.type === "EXTRACT_EVENT" || request.type === "CLASSIFY_EMAIL") {
    const emailBody = getEmailBody();
    if (!emailBody) {
      alert("Could not find email content.");
      return;
    }

    chrome.runtime.sendMessage(
      { type: request.type, text: emailBody },
      (response) => {
        if (response && response.success) {
          sendResponse({ data: response.data });
        } else {
          alert("AI action failed.");
          sendResponse({ success: false });
        }
      }
    );
    return true; // Keep channel open
  }
});
