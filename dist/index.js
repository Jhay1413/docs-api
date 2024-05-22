"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("./controller/auth/auth.route"));
const user_routes_1 = __importDefault(require("./controller/user/user.routes"));
const transaction_route_1 = __importDefault(require("./controller/transaction/transaction.route"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
const corsOptions = {
    origin: 'https://docs-client.onrender.com', // This is the origin of the client
    credentials: true, // This allows the session cookie to be sent with the request
};
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)(corsOptions));
app.use("/api/auth", auth_route_1.default);
app.use("/api/user", user_routes_1.default);
app.use("/api/transaction", transaction_route_1.default);
app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
