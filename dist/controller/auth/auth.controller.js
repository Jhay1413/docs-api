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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutHandler = exports.loginHander = void 0;
const http_status_codes_1 = require("http-status-codes");
const auth_service_1 = require("./auth.service");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const loginHander = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const rest = __rest(req.body, []);
    try {
        const user = yield (0, auth_service_1.checkUserAccountExists)(rest.email);
        console.log("loggggingggg eeeeeinnn");
        if (!user) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send("User not found !");
        }
        if (user.password !== rest.password) {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send("Incorrect password !");
        }
        const accessToken = jsonwebtoken_1.default.sign({ email: user.email }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
        const refreshToken = jsonwebtoken_1.default.sign({ email: user.email }, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
        if (process.env.NODE_ENV == "PRODUCTION") {
            res.cookie("refreshToken", refreshToken, {
                path: "/",
                domain: process.env.PROD_COOKIE_URL,
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                secure: true,
                sameSite: "none",
            });
            res.cookie("accessToken", accessToken, {
                path: "/",
                domain: process.env.PROD_COOKIE_URL,
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000,
                secure: true,
                sameSite: "none",
            });
        }
        else if (process.env.NODE_ENV == "DEVELOPMENT") {
            res.cookie("refreshToken", refreshToken, {
                path: "/",
                domain: process.env.DEV_COOKIE_URL,
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                secure: true,
                sameSite: "none",
            });
            res.cookie("accessToken", accessToken, {
                path: "/",
                domain: process.env.DEV_COOKIE_URL,
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000,
                secure: true,
                sameSite: "none",
            });
        }
        else {
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                secure: true,
                sameSite: "none",
            });
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000,
                secure: true,
                sameSite: "none",
            });
        }
        const payload = {
            email: user.email,
            name: (_a = user.userInfo) === null || _a === void 0 ? void 0 : _a.firstName,
            accountRole: user.accountRole,
            accountId: user.id,
            userId: (_b = user.userInfo) === null || _b === void 0 ? void 0 : _b.id,
            assignedDivision: (_c = user.userInfo) === null || _c === void 0 ? void 0 : _c.assignedDivision,
            assignedSection: (_d = user.userInfo) === null || _d === void 0 ? void 0 : _d.assignedPosition,
            assignedPosition: (_e = user.userInfo) === null || _e === void 0 ? void 0 : _e.assignedPosition,
        };
        res.status(http_status_codes_1.StatusCodes.OK).send(payload);
    }
    catch (error) {
        console.log(error);
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .send("Something went wrong while logging in");
    }
});
exports.loginHander = loginHander;
const logoutHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(201).send("Logout route");
});
exports.logoutHandler = logoutHandler;
