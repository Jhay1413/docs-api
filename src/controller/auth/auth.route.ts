import express, { Request, Response } from "express"
import { processRequestBody } from "zod-express-middleware";
import { loginSchema } from "./auth.schema";
import { loginHander } from "./auth.controller";
import { verifyUser } from "../../middleware/auth/verify_user";

const router = express.Router();

router.post("/login",processRequestBody(loginSchema.body),loginHander)

router.get('/logout', (req, res) => {
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    res.status(200).send("Logged out!");
});
router.post("/logout", (req, res) => { 
    res.send("Logout route");
})

router.post("/dashboardGateApi",verifyUser,(req:Request,res:Response)=>{
    
    res.status(200).send("Verified User!")
})

export default router