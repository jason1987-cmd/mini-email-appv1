const imaps = require("imap-simple");
const { simpleParser } = require("mailparser");

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return jsonResponse(405, { message: "Method Not Allowed" });
  }

  try {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      return jsonResponse(500, {
        message: "Missing Gmail environment variables."
      });
    }

    const config = {
      imap: {
        user: process.env.GMAIL_USER,
        password: process.env.GMAIL_APP_PASSWORD,
        host: "imap.gmail.com",
        port: 993,
        tls: true,
        authTimeout: 10000,
        tlsOptions: {
          rejectUnauthorized: true
        }
      }
    };

    const connection = await imaps.connect(config);
    await connection.openBox("INBOX");

    const searchCriteria = ["ALL"];
    const fetchOptions = {
      bodies: [""],
      markSeen: false
    };

    const messages = await connection.search(searchCriteria, fetchOptions);

    const latestMessages = messages.slice(-5).reverse();
    const inbox = [];

    for (const item of latestMessages) {
      const all = item.parts.find((part) => part.which === "");
      if (!all) continue;

      const parsed = await simpleParser(all.body);

      inbox.push({
        from: parsed.from?.text || "Unknown sender",
        subject: parsed.subject || "(No Subject)",
        text: parsed.text ? parsed.text.slice(0, 300) : "",
        date: parsed.date || null
      });
    }

    await connection.end();

    return jsonResponse(200, {
      success: true,
      count: inbox.length,
      emails: inbox
    });
  } catch (error) {
    return jsonResponse(500, {
      success: false,
      message: "Failed to read inbox.",
      error: error.message
    });
  }
};

function jsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  };
}
