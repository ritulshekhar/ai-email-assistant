async function rewriteWithAI(text, tone) {
  const response = await fetch("http://localhost:8000/rewrite", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, tone })
  });

  const data = await response.json();
  return data.rewritten_text;
}

function replaceSelectedText(newText) {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  range.deleteContents();
  range.insertNode(document.createTextNode(newText));
}

chrome.runtime.onMessage.addListener(async (request) => {
  if (request.type !== "REWRITE_EMAIL") return;

  const selection = window.getSelection();
  const text = selection.toString();

  if (!text) {
    alert("Please select text inside the Gmail compose box.");
    return;
  }

  try {
    const rewritten = await rewriteWithAI(text, request.tone);
    replaceSelectedText(rewritten);
  } catch (err) {
    alert("AI rewrite failed. Make sure backend is running.");
    console.error(err);
  }
});
