console.log("CONTENT SCRIPT LOADED");

// Helper functions

function getSelectedText() {
  const selection = window.getSelection();
  return selection ? selection.toString() : "";
}

function replaceSelectedText(newText) {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  range.deleteContents();
  range.insertNode(document.createTextNode(newText));
}

function getEmailBody() {
  const bodies = document.querySelectorAll("div[role='listitem']");
  let text = "";

  bodies.forEach(el => {
    if (el.innerText.length > text.length) {
      text = el.innerText;
    }
  });

  if (!text) {
    const alt = document.querySelector("div.a3s");
    if (alt) text = alt.innerText;
  }

  console.log("Extracted email body:", text);
  return text;
}

// Message Listener

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  // -------- Rewrite --------
  if (request.type === "REWRITE_EMAIL") {
    const text = getSelectedText();

    chrome.runtime.sendMessage({
      type: "REWRITE_BACKEND",
      text: text,
      tone: request.tone
    }, (response) => {
      if (response?.success) {
        replaceSelectedText(response.rewritten);
      } else {
        alert("AI rewrite failed");
      }
    });
  }

  // -------- Classify --------
  if (request.type === "CLASSIFY_EMAIL") {
    const text = getEmailBody();

    if (!text || text.trim().length < 20) {
      alert("Could not read email body. Open the email fully.");
      return;
    }

    chrome.runtime.sendMessage({
      type: "CLASSIFY_BACKEND",
      text: text
    }, (response) => {
      if (!response?.success) {
        alert("Email classification failed");
        return;
      }

      // Remove existing badge
      const oldBadge = document.getElementById("ai-email-category-badge");
      if (oldBadge) oldBadge.remove();

      // Create badge
      const badge = document.createElement("div");
      badge.id = "ai-email-category-badge";
      badge.innerText = "Category: " + response.category;

      badge.style.padding = "6px 10px";
      badge.style.margin = "10px 0";
      badge.style.display = "inline-block";
      badge.style.background = "#e0f2fe";
      badge.style.color = "#0369a1";
      badge.style.borderRadius = "6px";
      badge.style.fontWeight = "bold";
      badge.style.fontSize = "13px";

      const container = document.querySelector("div[role='main']");
      if (container) {
        container.prepend(badge);
      }
    });
  }

  // -------- Extract Dates --------
  if (request.type === "EXTRACT_EMAIL") {
    const text = getEmailBody();

    chrome.runtime.sendMessage({
      type: "EXTRACT_BACKEND",
      text: text
    }, (response) => {
      if (response?.success) {
        alert("Extracted Info:\n" + response.result);
      } else {
        alert("Date extraction failed");
      }
    });
  }

});
