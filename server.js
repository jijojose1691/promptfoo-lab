// server.js
const express = require('express');
const app = express();

// REQUIRED: Must be declared BEFORE routes to parse incoming JSON payloads
app.use(express.json());

const sessions = {};

app.post('/api/chat', (req, res) => {
  try {
    // Fallback safely if body is missing
    const { sessionId, message } = req.body || {};

    if (!message) {
      return res.status(400).json({ error: "Missing 'message' field in body" });
    }

    const sid = sessionId || 'default-session';
    if (!sessions[sid]) sessions[sid] = {};

    // 1. Safety / Moderation
    if (message.toLowerCase().includes('kill') || message.toLowerCase().includes('harm')) {
      return res.json({
        reply: "Sorry, your message couldn't be processed due to content guidelines."
      });
    }

    // 2. Memory Logic
    let reply = "";
    if (message.toLowerCase().includes("my name is")) {
      const name = message.split("is ")[1];
      sessions[sid].name = name;
      reply = `Hello ${name}! How can I help you today?`;
    } else if (message.toLowerCase().includes("what is my name")) {
      const name = sessions[sid].name;
      reply = name ? `Your name is ${name}.` : "I don't know your name yet.";
    } else if (message.toLowerCase().includes("stock price of apple")) {
      reply = "AAPL is currently trading at approximately $225.50.";
    } else {
      reply = `I received your message: "${message}"`;
    }

    // MUST return a JSON object containing the expected key
    return res.json({ reply });

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

app.listen(3000, () => console.log('App running on http://localhost:3000'));