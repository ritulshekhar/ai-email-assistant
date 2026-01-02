window.addEventListener("message", async (event) => {
  if (event.data.type !== "REWRITE_EMAIL") return;

  const tone = event.data.tone;
  const selectedText = window.getSelection().toString();

  if (!selectedText) {
    alert("Please select some email text first.");
    return;
  }

  // TEMP: just show what we captured
  alert(`Tone: ${tone}\n\nSelected Text:\n${selectedText}`);
});
