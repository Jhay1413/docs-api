"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("./controller/auth/auth.route"));
const user_routes_1 = __importDefault(require("./controller/user/user.routes"));
const transaction_route_1 = __importDefault(require("./controller/transaction/transaction.route"));
const company_route_1 = __importDefault(require("./controller/company/company.route"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_1 = __importDefault(require("http"));
const app = (0, express_1.default)();
app.locals.HIGHER_ROLE = ["MANAGER", "RECORDS"];
app.locals.LOWER_ROLE = ["TL", "CH"];
const corsOptions = {
    origin: ['https://dts-client.netlify.app', 'https://dts-new-client.vercel.app', 'http://localhost:5173', 'http://localhost:4173'], // This is the origin of the client
    credentials: true, // This allows the session cookie to be sent with the request
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api/auth", auth_route_1.default);
app.use("/api/user", user_routes_1.default);
app.use("/api/transaction", transaction_route_1.default);
app.use('/api/companies', company_route_1.default);
app.listen(3001 || process.env.PORT, () => {
    console.log("Server is running on port 3001");
});
const server = http_1.default.createServer(app);
server.keepAliveTimeout = 65000;
server.headersTimeout = 65000;
