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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDocumentsHandler = exports.transactionHandler = exports.transactionFilesHandler = void 0;
const aws_config_1 = require("../../services/aws-config");
const http_status_codes_1 = require("http-status-codes");
const transaction_service_1 = require("./transaction.service");
const transactionFilesHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    const fileNames = req.body.fileNames;
    const payload = [];
    try {
        if (files && Array.isArray(files) && files.length > 0) {
            const results = yield Promise.all(files.map((file, index) => (0, aws_config_1.uploadToS3)(file)));
            results.forEach((result, index) => {
                if (result instanceof Error) {
                    return;
                }
                payload.push(Object.assign(Object.assign({}, result), { fileName: fileNames[index] }));
            });
        }
        res.status(http_status_codes_1.StatusCodes.CREATED).json({ data: payload });
    }
    catch (error) {
        console.log(error);
        throw new Error("Error uploading files");
    }
});
exports.transactionFilesHandler = transactionFilesHandler;
const transactionHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const insert = yield (0, transaction_service_1.insertTransactionService)(req.body);
        if (insert) {
            res.status(http_status_codes_1.StatusCodes.CREATED).json({ message: "Transaction created" });
        }
    }
    catch (error) {
        console.log(error);
        throw new Error("Error creating transaction");
    }
});
exports.transactionHandler = transactionHandler;
const getDocumentsHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const documents = yield (0, transaction_service_1.getDocumentsService)();
        res.status(http_status_codes_1.StatusCodes.OK).json({ data: documents });
    }
    catch (error) {
        console.log(error);
        console.log(error);
        throw new Error("Error fetching documents");
    }
});
exports.getDocumentsHandler = getDocumentsHandler;
