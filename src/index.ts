import express from "express";
import s from "./utils/ts-rest-server";
import authRouter from "./controller/auth/auth.route";
import userRouter from "./controller/user/user.routes";
import transactionRouter from "./controller/transaction/transaction.route";
import companyRouter from "./controller/company/company.route";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import { TransactionService } from "./controller/transaction/transaction.service-v2";
import z from "zod";
import { registerTransactionRoutes } from "./controller/transaction/transaction.routes";

import { registerCompanyRoutes } from "./controller/company/company.routes";

import { registerUserRoutes } from "./controller/user/user.route";
import { registerFileRoutes } from "./controller/aws/aws.route";
import { dsahboardRoutes } from "./controller/dashboard/dashboard.route";

// Import For testing of Ticketing
import ticketingRoutes from "./controller/ticketing/ticketing.route";
import { registerTicketingRoutes } from "./controller/ticketing/ticketing.routes";
import { registerNotificationRoutes } from "./controller/notifications/notification.route";
import { NotificationService } from "./controller/notifications/notification.service";
import { TicketingService } from "./controller/ticketing/ticketing.service-v1";

const app = express();
const corsOptions = {
  origin: [
    "https://dts-client.netlify.app",
    "https://sweet-arithmetic-8496a1.netlify.app",
    "http://localhost:5173",
    "http://localhost:4173",
    "https://dts.envicomm.org",
  ], // This is the origin of the client
  credentials: true, // This allows the session cookie to be sent with the request
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
registerNotificationRoutes(app);
registerTicketingRoutes(app);
registerCompanyRoutes(app);
registerTransactionRoutes(app);
registerUserRoutes(app);
registerFileRoutes(app);
dsahboardRoutes(app);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/transaction", transactionRouter);
app.use("/api/companies", companyRouter);

// Router USe For testing of Ticketing
app.use("/api/ticketing", ticketingRoutes);

const userSockets = new Map<string, string>();

const server = http.createServer(app);

const transactionService = new TransactionService();
const ticketService = new TicketingService();
const notificationService = new NotificationService();
//SOCKET SETUP
const io = new Server(server, {
  cors: {
    origin: corsOptions.origin,
    credentials: corsOptions.credentials,
  },
});

io.on("connection", (socket) => {
  console.log("New client connected", userSockets);
  socket.on("register", async (userId) => {
    userSockets.set(userId, socket.id);
    const receiverSocketId = userSockets.get(userId);
    const message = false;

    try {
      const tracker = await transactionService.getIncomingTransaction(userId);
      const quantityTracker = { incoming: tracker.incoming, inbox: tracker.outgoing };
      const ticketTracker = await ticketService.getIncomingTickets(userId);

      io.to(receiverSocketId!).emit("notification", message, quantityTracker, ticketTracker);
    } catch (error) {
      const numOfUnreadNotif = 0;
      const quantityTracker = { incoming: 0, inbox: 0 };
      io.to(receiverSocketId!).emit("notification", message, quantityTracker, numOfUnreadNotif);
    }
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

server.listen(process.env.PORT || 3001, () => {
  console.log("Server is running on port 3001");
});
export { io, userSockets, s };
server.keepAliveTimeout = 65000;
server.headersTimeout = 65000;
