const sendForm = document.getElementById("sendForm");
const sendStatus = document.getElementById("sendStatus");
const refreshInboxBtn = document.getElementById("refreshInboxBtn");
const inboxStatus = document.getElementById("inboxStatus");
const inboxList = document.getElementById("inboxList");

sendForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  sendStatus.textContent = "Sending...";
  sendStatus.className = "status";

  const payload = {
    to: document.getElementById("to").value.trim(),
    subject: document.getElementById("subject").value.trim(),
    message: document.getElementById("message").value.trim()
  };

  try {
    const response = await fetch("/.netlify/functions/sendMail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to send email.");
    }

    sendStatus.textContent = data.message || "Email sent successfully.";
    sendStatus.className = "status success";
    sendForm.reset();
  } catch (error) {
    sendStatus.textContent = error.message || "Something went wrong.";
    sendStatus.className = "status error";
  }
});

refreshInboxBtn.addEventListener("click", loadInbox);

async function loadInbox() {
  inboxStatus.textContent = "Loading inbox...";
  inboxStatus.className = "status";
  inboxList.innerHTML = "";

  try {
    const response = await fetch("/.netlify/functions/readInbox");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to load inbox.");
    }

    inboxStatus.textContent = `Loaded ${data.count} email(s).`;
    inboxStatus.className = "status success";

    if (!data.emails || data.emails.length === 0) {
      inboxList.innerHTML = `<p class="muted">Inbox is empty.</p>`;
      return;
    }

    inboxList.innerHTML = data.emails
      .map((email) => {
        const safeSubject = escapeHtml(email.subject || "(No Subject)");
        const safeFrom = escapeHtml(email.from || "Unknown sender");
        const safeDate = email.date ? new Date(email.date).toLocaleString() : "Unknown date";
        const safeText = escapeHtml(email.text || "");

        return `
          <div class="email-card">
            <div class="email-subject">${safeSubject}</div>
            <div class="email-from">From: ${safeFrom}</div>
            <div class="email-date">Date: ${escapeHtml(safeDate)}</div>
            <div class="email-text">${safeText}</div>
          </div>
        `;
      })
      .join("");
  } catch (error) {
    inboxStatus.textContent = error.message || "Something went wrong.";
    inboxStatus.className = "status error";
    inboxList.innerHTML = `<p class="muted">Could not load inbox.</p>`;
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
