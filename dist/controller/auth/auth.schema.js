"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = {
    body: (0, zod_1.object)({
        email: (0, zod_1.string)({
            required_error: "email is required",
        }),
        password: (0, zod_1.string)({
            required_error: "password is required",
        })
            .min(6, "password must be at least 6 characters")
            .max(64, "password must not be longer than 64 charcters"),
    }),
};
