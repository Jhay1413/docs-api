"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_express_middleware_1 = require("zod-express-middleware");
const auth_schema_1 = require("./auth.schema");
const auth_controller_1 = require("./auth.controller");
const verify_user_1 = require("../../middleware/auth/verify_user");
const router = express_1.default.Router();
router.post("/login", (0, zod_express_middleware_1.processRequestBody)(auth_schema_1.loginSchema.body), auth_controller_1.loginHander);
router.get("/logout", (req, res) => {
    if (process.env.NODE_ENV === "PRODUCTION") {
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
    }
    if (process.env.NODE_ENV === "DEVELOPMENT") {
        res.cookie("refreshToken", "", {
            path: "/",
            domain: "dts-dev.onrender.com",
            expires: new Date(0),
            secure: true,
            httpOnly: true,
            sameSite: "none",
        });
        res.cookie("accessToken", "", {
            path: "/",
            domain: "dts-dev.onrender.com",
            expires: new Date(0),
            secure: true,
            httpOnly: true,
            sameSite: "none",
        });
    }
    else {
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
router.post("/dashboardGateApi", verify_user_1.verifyUser, (req, res) => {
    res.status(200).send("Verified User!");
});
exports.default = router;
