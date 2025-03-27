import { useEffect, useRef, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Paper,
  Stack,
} from "@mui/material";

const Chat = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [someoneTyping, setSomeoneTyping] = useState("");
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    socketRef.current = new WebSocket("ws://localhost:3001");

    socketRef.current.onmessage = (event) => {
      const data = event.data;

      if (data.includes("__typing__")) {
        const typer = data.replace("__typing__", "");
        if (typer !== username) {
          setSomeoneTyping(`${typer} is typing...`);
          setTimeout(() => setSomeoneTyping(""), 5000);
        }
        return;
      }

      setMessages((prev) => [...prev, data]);
    };

    fetch("http://localhost:3001/messages")
      .then((res) => res.json())
      .then((data) => setMessages(data));

    return () => socketRef.current?.close();
  }, [username]);

  const sendMessage = () => {
    if (message.trim() && username.trim()) {
      socketRef.current?.send(`${username}: ${message}`);
      setMessage("");
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);

    if (socketRef.current && username.trim()) {
      socketRef.current.send(`${username}__typing__`);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600, margin: "auto" }}>
      <Typography variant="h4" gutterBottom>
        💬 Real-Time Chat
      </Typography>

      <TextField
        fullWidth
        label="Your Name"
        value={username}
        onChange={(e) => {
          const value = e.target.value;
          setUsername(value);
          localStorage.setItem("username", value);
        }}
        sx={{ mb: 2 }}
      />

      {someoneTyping && (
        <Typography
          variant="body2"
          sx={{ color: "gray", fontStyle: "italic", mb: 1 }}
        >
          {someoneTyping}
        </Typography>
      )}

      <Paper
        elevation={3}
        sx={{
          height: 300,
          overflowY: "scroll",
          p: 2,
          mb: 2,
          backgroundColor: "#f5f5f5",
        }}
      >
        <Stack spacing={1}>
          {messages.map((msg, idx) => (
            <Typography key={idx}>{msg}</Typography>
          ))}
        </Stack>
      </Paper>

      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          label="Type your message"
          value={message}
          onChange={handleTyping}
        />
        <Button variant="contained" onClick={sendMessage}>
          Send
        </Button>
      </Stack>
    </Box>
  );
};

export default Chat;
