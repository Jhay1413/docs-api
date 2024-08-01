import dotenv from "dotenv";
import express from "express";
import authRouter from "./controller/auth/auth.route";
import userRouter from "./controller/user/user.routes";
import transactionRouter from "./controller/transaction/transaction.route";
import companyRouter from "./controller/company/company.route";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
const app = express();

app.locals.HIGHER_ROLE = ["MANAGER","RECORDS"];
app.locals.LOWER_ROLE = ["TL","CH"];
const corsOptions = {
  origin: ['https://dts-client.netlify.app','https://dts-new-client.vercel.app','http://localhost:5173','http://localhost:4173'], // This is the origin of the client
  credentials: true, // This allows the session cookie to be sent with the request
};


app.use(cors(corsOptions))
app.use(express.json());
app.use(cookieParser())

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/transaction", transactionRouter);
app.use('/api/companies',companyRouter)
app.listen(3001 || process.env.PORT, () => {
  console.log("Server is running on port 3001");
});
const server = http.createServer(app);

server.keepAliveTimeout = 65000;
server.headersTimeout = 65000;