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
exports.registerFileRoutes = void 0;
const ts_rest_server_1 = __importDefault(require("../../utils/ts-rest-server"));
const shared_contract_1 = require("shared-contract");
const aws_controller_1 = require("./aws.controller");
const express_1 = require("@ts-rest/express");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const fileRouter = ts_rest_server_1.default.router(shared_contract_1.contracts.awsContract, {
    getMultipleSignedUrl: (_a) => __awaiter(void 0, [_a], void 0, function* ({ body }) {
        try {
            const data = yield (0, aws_controller_1.getMultipleSignedUrlController)(body);
            return {
                status: 200,
                body: data,
            };
        }
        catch (error) {
            return {
                status: 500,
                body: {
                    error: "Something went wrong ",
                },
            };
        }
    }),
    getViewSignedUrl: (_b) => __awaiter(void 0, [_b], void 0, function* ({ query }) {
        try {
            const response = yield (0, aws_controller_1.getViewSignedUrls)(query.data);
            return {
                status: 200,
                body: response,
            };
        }
        catch (error) {
            return {
                status: 500,
                body: {
                    error: "Something went wrong ",
                },
            };
        }
    }),
    getSignedUrl: (_c) => __awaiter(void 0, [_c], void 0, function* ({ query }) {
        try {
            const response = yield (0, aws_controller_1.transactionSignedUrlV2)(query.company, query.fileName, query.fileType);
            return {
                status: 200,
                body: Object.assign(Object.assign({}, response), { fileType: query.fileType, fileName: query.fileName, company: query.company }),
            };
        }
        catch (error) {
            console.log(error);
            return {
                status: 500,
                body: {
                    error: "Something went wrong ",
                },
            };
        }
    }),
    uploadDocument: {
        middleware: [upload.single("thumbnail")],
        handler: (_d) => __awaiter(void 0, [_d], void 0, function* ({ file, body }) {
            const document = file;
            const result = yield (0, aws_controller_1.uploadSingleFile)(body.company, body.fileName, document);
            return {
                status: 200,
                body: { key: result.response },
            };
        }),
    },
});
const registerFileRoutes = (app) => {
    (0, express_1.createExpressEndpoints)(shared_contract_1.contracts.awsContract, fileRouter, app);
};
exports.registerFileRoutes = registerFileRoutes;
