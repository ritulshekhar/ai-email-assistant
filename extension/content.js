function getSelectedText() {
  const activeEl = document.activeElement;

  // Case 1: Gmail compose box (contenteditable)
  if (activeEl && activeEl.isContentEditable) {
    return window.getSelection().toString();
  }

  // Case 2: Try normal selection
  const selection = window.getSelection();
  if (selection && selection.toString()) {
    return selection.toString();
  }

  return "";
}

window.addEventListener("message", (event) => {
  if (event.data.type !== "REWRITE_EMAIL") return;

  const tone = event.data.tone;
  const selectedText = getSelectedText();

  console.log("Tone:", tone);
  console.log("Selected text:", selectedText);

  if (!selectedText) {
    alert("No text detected. Please select text inside the email or compose box.");
    return;
  }

  alert(
    `Captured successfully!\n\nTone: ${tone}\n\nText:\n${selectedText}`
  );
});
