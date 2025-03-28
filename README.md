# WebSockets-RealTimeChat
This is a full-stack real-time chat application built for the Devek Developer Assignment. It allows users to communicate live using WebSockets with features like persistent usernames, typing indicators, message history, and a modern UI built with Material UI.

## Features

- Real-time messaging using WebSocket
- Broadcast to all connected users
- Message history retrieval via REST API
- Typing indicator when users are composing messages
- Username persistence using localStorage
- Clear chat functionality (frontend + backend)
- Fully responsive UI using MUI

## Tech Stack

- React (TypeScript)
- Node.js with Express and WebSocket (ws)
- Material UI (MUI)
- Git & GitHub
- Devek.dev Plugin (coding activity tracking)

## Getting Started

1. Clone the repo  
   git clone https://github.com/AishwaryaSimhaPraveen/WebSockets-RealTimeChat.git  
   cd WebSockets-RealTimeChat

2. Run the backend  
   cd backend  
   npm install  
   node server.js

3. Run the frontend  
   cd ../frontend  
   npm install  
   npm start

## How to Test

1. Open two browser tabs or separate windows.
2. In each tab, enter a different username.
3. Send messages from one tab and verify they appear in the other instantly.
4. Try typing in one tab — the other tab will show a typing indicator.
5. Click the “Clear Chat” button to delete the message history.
6. Refresh both tabs to confirm that chat history is empty after clearing.

This ensures real-time communication, message broadcasting, persistence, and typing indicator functionality are all working as expected.


## Project Author

Aishwarya Simha Praveen
GitHub: https://github.com/AishwaryaSimhaPraveen