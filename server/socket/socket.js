import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// export const getReceiverId = (receivedId) => {
//   return userSocketMap[receivedId];
// };

// const userSocketMap = {};

// io.on("connection", (socket) => {
//   console.log("A user connected", socket.id);

//   const userId = socket.handshake.query.userId;
//   if (userId !== "undefined") userSocketMap[userId] = socket.id;

//   //Send events to all connected clients.
//   io.emit("getOnlineUsers", Object.keys(userSocketMap));

//   socket.on("disconnect", () => {
//     console.log("user disconnect", socket.id);
//     delete userSocketMap[userId];
//     io.emit("getOnlineUsers", Object.keys(userSocketMap));
//   });
// });

io.on("connection", (socket) => {
  console.log("New client connected for signaling");

  socket.on("joinRoom", ({ userId, doctorId }) => {
    const room =
      userId > doctorId ? `${userId}_${doctorId}` : `${doctorId}_${userId}`;
    socket.join(room);
  });

  socket.on("chatMessage", ({ message, userId, doctorId }) => {
    const room =
      userId > doctorId ? `${userId}_${doctorId}` : `${doctorId}_${userId}`;
    io.to(room).emit("chatMessage", message);
  });

  // WebRTC signaling
  socket.on("offer", (payload) => {
    const { userId, doctorId, offer } = payload;
    const room =
      userId > doctorId ? `${userId}_${doctorId}` : `${doctorId}_${userId}`;
    socket.to(room).emit("offer", offer);
  });

  socket.on("answer", (payload) => {
    const { userId, doctorId, answer } = payload;
    const room =
      userId > doctorId ? `${userId}_${doctorId}` : `${doctorId}_${userId}`;
    socket.to(room).emit("answer", answer);
  });

  socket.on("ice-candidate", (payload) => {
    const { userId, doctorId, candidate } = payload;
    const room =
      userId > doctorId ? `${userId}_${doctorId}` : `${doctorId}_${userId}`;
    socket.to(room).emit("ice-candidate", candidate);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

export { app, io, server };
