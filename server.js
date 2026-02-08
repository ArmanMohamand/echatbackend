import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./connection.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";
import { Socket } from "dgram";

// Connection
await connectDB();

// App config
const app = express();

const server = http.createServer(app);

// initialize sockrt.io
export const io = new Server(server, {
  cors: { origin: "*" }, 
});
// store online users
export const userSocketMap = {}; //{userId : socketId}

// Socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("user Connection", userId);
  if (userId) userSocketMap[userId] = socket.id;
  //   Emit online user to all connected clinets
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User Disconnected", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Middleware setup
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// Routers
app.use("/api/auth", userRouter);
app.use("/api/status", (req, res) => res.send("server is live"));
app.use("/api/messages", messageRouter);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
