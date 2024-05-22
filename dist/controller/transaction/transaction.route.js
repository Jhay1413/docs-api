"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const zodValidation_1 = require("../../middleware/zodValidation");
const transaction_schema_1 = require("./transaction.schema");
const transaction_controller_1 = require("./transaction.controller");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
router.post("/upload", upload.array("files"), transaction_controller_1.transactionFilesHandler);
router.post("/", (0, zodValidation_1.validateData)(transaction_schema_1.transactionData), transaction_controller_1.transactionHandler);
router.get("/", transaction_controller_1.getDocumentsHandler);
exports.default = router;
