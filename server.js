// server.js
const express = require('express');
const app = express();
app.use(express.json());

const sessions = {};

// Mock Internal RAG Database
const KNOWLEDGE_BASE = {
  "return_policy": "Customers can return items within 30 days of purchase with a valid receipt. Shipping fees are non-refundable.",
  "interest_rate": "The current standard APR for high-yield savings is 4.25%."
};

app.post('/api/chat', (req, res) => {
  try {
    const { sessionId, message, format } = req.body || {};

    if (!message) {
      return res.status(400).json({ error: "Missing 'message' field in body" });
    }

    const sid = sessionId || 'default-session';
    if (!sessions[sid]) sessions[sid] = { history: [] };

    // 1. Safety & Guardrails / Red-Teaming
    if (message.toLowerCase().includes('kill') || message.toLowerCase().includes('ignore previous instructions')) {
      return res.json({
        reply: "Sorry, your request cannot be processed due to safety and system security guidelines."
      });
    }

    // 2. Format Specification: JSON Structured Output
    if (format === 'json' || message.toLowerCase().includes('json')) {
      return res.json({
        reply: JSON.stringify({
          status: "success",
          stock: "AAPL",
          price: 225.50,
          currency: "USD"
        })
      });
    }

    // 3. RAG / Knowledge Base Retrieval
    if (message.toLowerCase().includes("return policy")) {
      return res.json({ reply: `According to our policy: ${KNOWLEDGE_BASE.return_policy}` });
    }

    // 4. Multi-turn Session Memory
    if (message.toLowerCase().includes("my name is")) {
      const name = message.split("is ")[1];
      sessions[sid].name = name;
      return res.json({ reply: `Hello ${name}! How can I assist with your financial portfolio today?` });
    }

    if (message.toLowerCase().includes("what is my name")) {
      const name = sessions[sid].name;
      return res.json({
        reply: name ? `Your name is ${name}.` : "I do not have your name recorded in this session."
      });
    }

    // 5. General Fallback
    return res.json({ reply: `I processed your request: "${message}". How else may I assist you?` });

  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

app.listen(3000, () => console.log('Extended Application Server running on http://localhost:3000'));