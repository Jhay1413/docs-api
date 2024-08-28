import express, { Request, Response } from "express";
import { processRequestBody } from "zod-express-middleware";
import { loginSchema } from "./auth.schema";
import { loginHander } from "./auth.controller";
import { verifyUser } from "../../middleware/auth/verify_user";

const router = express.Router();

router.post("/login", processRequestBody(loginSchema.body), loginHander);

router.get("/logout", (req, res) => {
  if (process.env.NODE_ENV === "PRODUCTION") {
    console.log("im on prod")
    res.cookie("refreshToken", "", {
      path: "/",
      domain: process.env.PROD_COOKIE_URL,
      expires: new Date(0),
      secure: true,
      httpOnly: true,
      sameSite: "none", 
    });

    res.cookie("accessToken", "", {
      path: "/",
      domain: process.env.PROD_COOKIE_URL,
      expires: new Date(0),
      secure: true,
      httpOnly: true,
      sameSite: "none",
    });
  } else if (process.env.NODE_ENV === "DEVELOPMENT") {
    console.log("im on dev")
    res.cookie("refreshToken", "", {
      path: "/",
      domain: process.env.DEV_COOKIE_URL,
      expires: new Date(0),
      secure: true,
      httpOnly: true,
      sameSite: "none",
    });

    res.cookie("accessToken", "", {
      path: "/",
      domain: process.env.DEV_COOKIE_URL,
      expires: new Date(0),
      secure: true,
      httpOnly: true,
      sameSite: "none",
    });
  } else {
    console.log("im on local")
    res.cookie("refreshToken", "", {
      path: "/",
      domain: "localhost",
      expires: new Date(0),
      secure: true,
      httpOnly: true,
      sameSite: "none",
    });
    res.cookie("accessToken", "", {
      path: "/",
      domain: "localhost",
      expires: new Date(0),
      secure: true,
      httpOnly: true,
      sameSite: "none",
    });
  }

  res.status(200).send("Logged out!");
});

router.post("/dashboardGateApi", verifyUser, (req: Request, res: Response) => {
  res.status(200).send("Verified User!");
});

export default router;
