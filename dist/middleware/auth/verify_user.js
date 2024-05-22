"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = __importDefault(require("zod"));
const decodedSchema = zod_1.default.object({
    email: zod_1.default.string(),
    iat: zod_1.default.number(),
    exp: zod_1.default.number(),
});
const verifyUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        if (yield renewToken(req, res)) {
            next();
        }
    }
    else {
        jsonwebtoken_1.default.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                console.log(err);
                return res.status(401).send("Unauthorized");
            }
            else {
                const decodedPayload = decoded;
                req.body.email = decodedPayload.email;
                next();
            }
        });
    }
});
exports.verifyUser = verifyUser;
const renewToken = (req, res) => {
    return new Promise((resolve, reject) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.status(401).send("Unauthorized");
            resolve(false);
        }
        else {
            jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    res.status(401).send("Unauthorized");
                    resolve(false);
                }
                else {
                    const decodedPayload = decoded;
                    req.body.email = decodedPayload.email;
                    resolve(true);
                }
            });
        }
    });
};
