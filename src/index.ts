import dotenv from "dotenv";
import express from "express";
import authRouter from "./controller/auth/auth.route";
import userRouter from "./controller/user/user.routes";
import transactionRouter from "./controller/transaction/transaction.route";
import companyRouter from "./controller/company/company.route";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
const app = express();

const corsOptions = {
  origin: [
    "https://dts-client.netlify.app",
    "https://dts-new-client.vercel.app",
    "http://localhost:5173",
    "http://localhost:4173",
  ], // This is the origin of the client
  credentials: true, // This allows the session cookie to be sent with the request
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/transaction", transactionRouter);
app.use("/api/companies", companyRouter);

const userSockets = new Map<string, string>();

const server = http.createServer(app);

//SOCKET SETUP
const io = new Server(server, {
  cors: {
    origin: corsOptions.origin,
    credentials: corsOptions.credentials,
  },
});

io.on("connection", (socket) => {
  console.log("New client connected", userSockets);
  socket.on("register", (userId) => {
    userSockets.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ID ${socket.id}`);
  });
  socket.on("disconnect", () => {
    for (const [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        userSockets.delete(userId);
        console.log(`User disconnected: ${userId}`);
        break;
      }
    }
    console.log("Client disconnected");
  });
  // socket.on("sendNotification", ({ targetUserId, message }) => {
  //   console.log(targetUserId)
  //   const socketId = userSockets[targetUserId];
  //   if (socketId) {
  //     io.to(socketId).emit("notification", message);
  //   }
  // });
});

server.listen(3001 || process.env.PORT, () => {
  console.log("Server is running on port 3001");
});
export{
  io,
  userSockets
}
server.keepAliveTimeout = 65000;
server.headersTimeout = 65000;