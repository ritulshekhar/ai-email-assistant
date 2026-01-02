(function () {
  console.log("Content script loaded: Smart Inbox Grouping");

  // Prevent duplicate execution
  if (window.__SMART_INBOX_LOADED__) {
    console.log("Smart Inbox already initialized");
    return;
  }
  window.__SMART_INBOX_LOADED__ = true;

  // Utility: wait for element
  function waitForElement(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const interval = setInterval(() => {
        const el = document.querySelector(selector);
        if (el) {
          clearInterval(interval);
          resolve(el);
        }
        if (Date.now() - start > timeout) {
          clearInterval(interval);
          reject("Timeout waiting for element");
        }
      }, 300);
    });
  }

  // Create badge
  function createBadge(label) {
    const badge = document.createElement("span");
    badge.innerText = label.toUpperCase();

    const colors = {
      Interview: "#16a34a",
      Promotion: "#ca8a04",
      Spam: "#dc2626",
      Other: "#6b7280",
    };

    badge.style.background = colors[label] || "#6b7280";
    badge.style.color = "white";
    badge.style.padding = "4px 10px";
    badge.style.borderRadius = "999px";
    badge.style.fontSize = "12px";
    badge.style.fontWeight = "600";
    badge.style.marginRight = "10px";

    badge.setAttribute("data-smart-badge", "true");
    return badge;
  }

  function removeExistingBadge() {
    const old = document.querySelector("[data-smart-badge]");
    if (old) old.remove();
  }

  function extractEmailText() {
    const body = document.querySelector("div[role='listitem'] div[dir='ltr']");
    if (!body) return null;
    return body.innerText.trim();
  }

  async function injectBadge(category) {
    try {
      const header = await waitForElement("h2.hP");
      removeExistingBadge();
      const badge = createBadge(category);
      header.prepend(badge);
    } catch (err) {
      console.warn("Badge injection failed:", err);
    }
  }

  async function classifyEmail(text) {
    const res = await fetch("http://127.0.0.1:8000/classify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) throw new Error("Classification failed");
    const data = await res.json();
    return data.category || "Other";
  }

  async function handleEmailOpen() {
    try {
      const text = extractEmailText();
      if (!text || text.length < 20) return;

      const category = await classifyEmail(text);
      console.log("Email classified as:", category);
      await injectBadge(category);
    } catch (err) {
      console.error("Smart inbox error:", err);
    }
  }

  const observer = new MutationObserver(() => {
    if (location.hash.includes("#inbox") || location.hash.includes("#all")) {
      handleEmailOpen();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
