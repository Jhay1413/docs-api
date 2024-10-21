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
import { AccountQuerySchema } from "shared-contract/dist/schema/users/query-schema";
import { registerUserRoutes } from "./controller/user/user.route";
import { registerFileRoutes } from "./controller/aws/aws.route";
import { dsahboardRoutes } from "./controller/dashboard/dashboard.route";
import { disableAfter5PM } from "./middleware/time-checker";

// Import For testing of Ticketing
import ticketingRoutes from "./controller/ticketing/ticketing.routes";

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

const userService = new TransactionService();
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
    console.log(`User ${userId} registered with socket ID ${socket.id}`);
    const receiverSocketId = userSockets.get(userId);

    try {
      const notifications = await userService.fetchAllNotificationById(userId);

      const modified_message = notifications.map((data) => {
        const userInfo = data.forwarder as z.infer<typeof AccountQuerySchema>;
        return { ...data, message: ` ${userInfo.userInfo?.firstName} ${userInfo.userInfo?.lastName} ${data.message}` };
      });
      const tracker = await userService.getIncomingTransaction(userId);
      let message = null;
      const countUnreadNotif = notifications.filter((data) => data.isRead === false).length;
      const quantityTracker = { incoming: tracker.incoming, inbox: tracker.outgoing };

      if (countUnreadNotif !== 0) {
        message = `You have ${countUnreadNotif} unread notifications `;
      } else {
        message = null;
      }

      io.to(receiverSocketId!).emit("notification", message, modified_message, quantityTracker);
    } catch (error) {
      const message = "Something went wrong !";
      const notifications = null,
        quantityTracker = null;
      io.to(receiverSocketId!).emit("notification", message, notifications, quantityTracker);
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
