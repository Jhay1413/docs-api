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
router.get('/logout', (req, res) => {
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    res.status(200).send("Logged out!");
});
router.post("/logout", (req, res) => {
    res.send("Logout route");
});
router.post("/dashboardGateApi", verify_user_1.verifyUser, (req, res) => {
    res.status(200).send("Verified User!");
});
exports.default = router;
