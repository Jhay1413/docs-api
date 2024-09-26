"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s = exports.userSockets = exports.io = void 0;
const express_1 = __importDefault(require("express"));
const ts_rest_server_1 = __importDefault(require("../src/utils/ts-rest-server"));
exports.s = ts_rest_server_1.default;
const auth_route_1 = __importDefault(require("./controller/auth/auth.route"));
const user_routes_1 = __importDefault(require("./controller/user/user.routes"));
const transaction_route_1 = __importDefault(require("./controller/transaction/transaction.route"));
const company_route_1 = __importDefault(require("./controller/company/company.route"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const transaction_service_v2_1 = require("./controller/transaction/transaction.service-v2");
const transaction_routes_1 = require("./controller/transaction/transaction.routes");
const company_routes_1 = require("./controller/company/company.routes");
const app = (0, express_1.default)();
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
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
(0, company_routes_1.registerCompanyRoutes)(app);
(0, transaction_routes_1.registerTransactionRoutes)(app);
app.use("/api/auth", auth_route_1.default);
app.use("/api/user", user_routes_1.default);
app.use("/api/transaction", transaction_route_1.default);
app.use("/api/companies", company_route_1.default);
const userSockets = new Map();
exports.userSockets = userSockets;
const server = http_1.default.createServer(app);
const userService = new transaction_service_v2_1.TransactionService();
//SOCKET SETUP
const io = new socket_io_1.Server(server, {
    cors: {
        origin: corsOptions.origin,
        credentials: corsOptions.credentials,
    },
});
exports.io = io;
io.on("connection", (socket) => {
    console.log("New client connected", userSockets);
    socket.on("register", (userId) => __awaiter(void 0, void 0, void 0, function* () {
        userSockets.set(userId, socket.id);
        console.log(`User ${userId} registered with socket ID ${socket.id}`);
        const receiverSocketId = userSockets.get(userId);
        try {
            const notifications = yield userService.fetchAllNotificationById(userId);
            const { incomingCount, outgoingCount } = yield userService.getIncomingTransaction(userId);
            let message = null;
            const countUnreadNotif = notifications.filter((data) => data.isRead === false).length;
            const quantityTracker = { incoming: incomingCount, inbox: outgoingCount };
            if (countUnreadNotif !== 0) {
                message = `You have ${countUnreadNotif} unread notifications `;
            }
            else {
                message = null;
            }
            io.to(receiverSocketId).emit("notification", message, notifications, quantityTracker);
        }
        catch (error) {
            const message = "Something went wrong !";
            const notifications = null, quantityTracker = null;
            io.to(receiverSocketId).emit("notification", message, notifications, quantityTracker);
        }
    }));
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
server.keepAliveTimeout = 65000;
server.headersTimeout = 65000;
