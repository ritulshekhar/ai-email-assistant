
async function rewriteWithAI(text, tone) {
  const response = await fetch("http://127.0.0.1:8000/rewrite", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text: text,
      tone: tone
    })
  });

  if (!response.ok) {
    throw new Error("Backend request failed");
  }

  const data = await response.json();
  return data.rewritten_text;
}

function replaceSelectedText(newText) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  range.deleteContents();
  range.insertNode(document.createTextNode(newText));
}

chrome.runtime.onMessage.addListener(async (request) => {
  if (request.type !== "REWRITE_EMAIL") return;

  const selection = window.getSelection();
  const selectedText = selection.toString();

  if (!selectedText) {
    alert("Please select text inside the Gmail compose box.");
    return;
  }

  try {
    const rewrittenText = await rewriteWithAI(
      selectedText,
      request.tone
    );
    replaceSelectedText(rewrittenText);
  } catch (error) {
    console.error("AI rewrite failed:", error);
    alert("AI rewrite failed. Make sure backend is running.");
  }
});
