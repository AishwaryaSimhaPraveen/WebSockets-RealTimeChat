import { useEffect, useRef, useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  TextField,
  Typography,
  Button,
  Paper,
  Stack,
  Container,
} from "@mui/material";

const Chat = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [someoneTyping, setSomeoneTyping] = useState("");
  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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
          setTimeout(() => setSomeoneTyping(""), 3000);
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Real-Time Chat</Typography>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f0f2f5",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 2,
        }}
      >
        <Paper elevation={4} sx={{ width: "100%", maxWidth: 600, padding: 4 }}>
          <Typography variant="h5" gutterBottom>
            Welcome to the Chat Room
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
              sx={{ color: "gray", fontStyle: "italic", mb: 1, ml: 1 }}
            >
              {someoneTyping}
            </Typography>
          )}

          <Paper
            elevation={1}
            sx={{
              height: 300,
              overflowY: "scroll",
              p: 2,
              mb: 2,
              backgroundColor: "#fafafa",
              border: "1px solid #ddd",
            }}
          >
            <Stack spacing={1}>
              {messages.map((msg, idx) => (
                <Typography key={idx}>{msg}</Typography>
              ))}
              <div ref={messagesEndRef} />
            </Stack>
          </Paper>

          <Stack direction="row" spacing={1}>
            <TextField
              fullWidth
              label="Type your message"
              value={message}
              onChange={handleTyping}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button variant="contained" onClick={sendMessage}>
              Send
            </Button>
          </Stack>
        </Paper>
      </Box>
    </>
  );
};

export default Chat;
