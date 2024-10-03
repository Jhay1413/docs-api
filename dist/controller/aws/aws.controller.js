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
exports.transactionSignedUrl = exports.transactionGetSignedUrl = void 0;
const aws_config_1 = require("../../services/aws-config");
const http_status_codes_1 = require("http-status-codes");
const transaction_schema_1 = require("../transaction/transaction.schema");
const transactionGetSignedUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { key } = req.query;
    try {
        const signedUrl = yield (0, aws_config_1.getSignedUrlFromS3)(key);
        res.status(http_status_codes_1.StatusCodes.OK).json(signedUrl);
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.GATEWAY_TIMEOUT).json(error);
    }
});
exports.transactionGetSignedUrl = transactionGetSignedUrl;
const transactionSignedUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    console.log(data);
    try {
        const validateData = transaction_schema_1.paramsRequestData.safeParse(data);
        if (!validateData.success) {
            console.log(validateData.error);
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json("Invalid Data on request");
        }
        const signedUrls = yield Promise.all(validateData.data.map((data) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { key, url } = yield (0, aws_config_1.getUploadSignedUrlFromS3)(data.company, data.fileName);
                return Object.assign(Object.assign({}, data), { key, signedUrl: url, signedStatus: true });
            }
            catch (error) {
                console.error(`Error fetching signed URL for ${data.fileName}:`, error);
                return Object.assign(Object.assign({}, data), { signedStatus: false });
            }
        })));
        res.status(http_status_codes_1.StatusCodes.CREATED).json(signedUrls);
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_GATEWAY).json(error);
    }
});
exports.transactionSignedUrl = transactionSignedUrl;
