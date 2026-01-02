console.log("Content script loaded");

// Utility: resolve relative date
function resolveDate(dateText) {
  if (!dateText || dateText === "none") return null;

  const today = new Date();
  const lower = dateText.toLowerCase();

  if (lower.includes("tomorrow")) {
    today.setDate(today.getDate() + 1);
    return today.toISOString().split("T")[0];
  }

  if (lower.includes("today")) {
    return today.toISOString().split("T")[0];
  }

  if (lower.includes("next week")) {
    today.setDate(today.getDate() + 7);
    return today.toISOString().split("T")[0];
  }

  // Try parsing explicit date
  const parsed = new Date(dateText);
  if (!isNaN(parsed)) {
    return parsed.toISOString().split("T")[0];
  }

  return null;
}

// Listen for classification request
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.type !== "CLASSIFY_EMAIL") return;

  try {
    const emailBody =
      document.querySelector("div[role='listitem'] div[dir='ltr']")?.innerText ||
      document.querySelector("div[dir='ltr']")?.innerText ||
      "";

    if (!emailBody) {
      alert("Could not read email content.");
      return;
    }

    const res = await fetch("http://127.0.0.1:8000/extract-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: emailBody })
    });

    const data = await res.json();

    const resolvedDate = resolveDate(data.date_text);

    alert(
      "Extracted Info:\n" +
      JSON.stringify(
        {
          event_type: data.event_type,
          date: resolvedDate || "unresolved",
          time: data.time
        },
        null,
        2
      )
    );

  } catch (err) {
    console.error(err);
    alert("Event extraction failed.");
  }
});
