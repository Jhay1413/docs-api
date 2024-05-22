"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFileName = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateFileName = (bytes = 32) => crypto_1.default.randomBytes(bytes).toString("hex");
exports.generateFileName = generateFileName;
