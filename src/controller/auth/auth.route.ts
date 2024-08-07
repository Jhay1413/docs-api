import express, { Request, Response } from "express"
import { processRequestBody } from "zod-express-middleware";
import { loginSchema } from "./auth.schema";
import { loginHander } from "./auth.controller";
import { verifyUser } from "../../middleware/auth/verify_user";

const router = express.Router();

router.post("/login",processRequestBody(loginSchema.body),loginHander)

router.get('/logout', (req, res) => {
    res.cookie('refreshToken', { path: '/', domain: 'docs-api-9r6n.onrender.com',secure: true, httpOnly: true,sameSite:"none",expires:new Date()});
    res.cookie('accessToken', { path: '/', domain: 'docs-api-9r6n.onrender.com',secure: true, httpOnly: true,sameSite:"none" ,expires:new Date() });

    res.clearCookie('refreshToken', { path: '/', domain: 'localhost',secure: true, httpOnly: true,sameSite:"none" });
    res.clearCookie('accessToken', { path: '/', domain: 'localhost' ,secure: true, httpOnly: true,sameSite:"none" });
    res.status(200).send("Logged out!");
});

router.post("/dashboardGateApi",verifyUser,(req:Request,res:Response)=>{

    res.status(200).send("Verified User!")
})

export default router