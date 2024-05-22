import dotenv from "dotenv";
import express from "express";
import authRouter from "./controller/auth/auth.route";
import userRouter from "./controller/user/user.routes";
import transactionRouter from "./controller/transaction/transaction.route";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
const corsOptions = {
  origin: 'http://localhost:5173', // This is the origin of the client
  credentials: true, // This allows the session cookie to be sent with the request
};
app.use(express.json());
app.use(cookieParser())
app.use(cors(corsOptions))
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/transaction", transactionRouter);
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
