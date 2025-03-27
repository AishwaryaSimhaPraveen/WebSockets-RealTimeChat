const express = require("express");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let messageHistory = []; // 💾 store chat messages

wss.on("connection", (ws) => {
  console.log("🟢 New client connected");

  ws.on("message", (data) => {
    const msg = data.toString();
    console.log("📨 Received:", msg);

    // 💬 Broadcast message to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    });

    // ✅ Save to history only if it's not a typing event
    if (!msg.includes("__typing__")) {
      messageHistory.push(msg);
    }
  });

  ws.on("close", () => {
    console.log("🔴 Client disconnected");
  });
});

// 🛠 Add a GET API to return previous messages
app.get("/messages", (req, res) => {
  res.json(messageHistory);
});

server.listen(PORT, () => {
  console.log(`✅ WebSocket server running on ws://localhost:${PORT}`);
});
