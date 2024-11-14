"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disableAfter5PM = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = __importDefault(require("zod"));
const decodedSchema = zod_1.default.object({
    email: zod_1.default.string(),
    role: zod_1.default.string(),
    iat: zod_1.default.number(),
    exp: zod_1.default.number(),
});
function getDateAndTimeInManila() {
    const options = {
        timeZone: "Asia/Manila",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // Use 24-hour format
    };
    // Create a new Date object
    const date = new Date();
    // Format the date and time to Manila's time zone
    const manilaTime = date.toLocaleString("en-PH", options);
    // Convert the formatted string back to a Date object
    return new Date(manilaTime);
}
const disableAfter5PM = (req, res, next) => {
    const manilaDateTime = getDateAndTimeInManila();
    const currentHour = manilaDateTime.getHours();
    const accessToken = req.cookies.accessToken;
    console.log(currentHour);
    if (!accessToken) {
        return res.status(401).send("Unauthorized");
    }
    jsonwebtoken_1.default.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.log(err);
            return res.status(401).send("Unauthorized");
        }
        const decodedPayload = decoded;
        if (decodedPayload.role === "MANAGER" || decodedPayload.role === "SUPERADMIN") {
            return next();
        }
        if (currentHour >= 18) {
            console.log(decodedPayload.role);
            return res.status(403).json({ message: "Access Denied." });
        }
        return next();
    });
};
exports.disableAfter5PM = disableAfter5PM;
