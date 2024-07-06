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
Object.defineProperty(exports, "__esModule", { value: true });
exports.forwardTransactionHandler = exports.getTransactionByParams = exports.getTransactionByParamsHandler = exports.receivedTransactionHandler = exports.incomingTransactionHandler = exports.getTransactionHandler = exports.getTransactionsHandler = exports.transactionHandler = exports.transactionFilesHandler = void 0;
const transaction_schema_1 = require("./transaction.schema");
const aws_config_1 = require("../../services/aws-config");
const http_status_codes_1 = require("http-status-codes");
const transaction_service_1 = require("./transaction.service");
const generate_id_1 = require("../../utils/generate-id");
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
        return res.status(500).json(error);
    }
});
exports.transactionFilesHandler = transactionFilesHandler;
const transactionHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const lastId = yield (0, transaction_service_1.getLastId)();
        const generatedId = (0, generate_id_1.GenerateId)(lastId);
        const data = Object.assign(Object.assign({}, req.body), { transactionId: generatedId });
        const response = yield (0, transaction_service_1.insertTransactionService)(data);
        const validatedData = transaction_schema_1.transactionData.safeParse(response);
        console.log((_a = validatedData.error) === null || _a === void 0 ? void 0 : _a.errors);
        if (validatedData.error) {
            return res.status(500).json("something went wrong!");
        }
        console.log(validatedData.data);
        const cleanedData = Object.assign(Object.assign({}, validatedData.data), { company: (_b = validatedData.data.company) === null || _b === void 0 ? void 0 : _b.companyName, project: (_c = validatedData.data.project) === null || _c === void 0 ? void 0 : _c.projectName, forwardedBy: validatedData.data.forwarder.email, attachments: validatedData.data.attachment, receivedBy: ((_d = validatedData.data.receive) === null || _d === void 0 ? void 0 : _d.email) || null, transactionId: validatedData.data.id });
        const { receivedById, receive, forwarder, id } = cleanedData, payload = __rest(cleanedData, ["receivedById", "receive", "forwarder", "id"]);
        const logData = yield (0, transaction_service_1.logPostTransactions)(payload);
        return res.status(http_status_codes_1.StatusCodes.CREATED).json(response);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});
exports.transactionHandler = transactionHandler;
const getTransactionsHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const documents = yield (0, transaction_service_1.getTransactionService)();
        res.status(http_status_codes_1.StatusCodes.OK).json(documents);
    }
    catch (error) {
        console.log(error);
        console.log(error);
        return res.status(500).json(error);
    }
});
exports.getTransactionsHandler = getTransactionsHandler;
const getTransactionHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params.id);
    try {
        const transaction = yield (0, transaction_service_1.getTransactionById)(req.params.id);
        console.log(transaction);
        res.status(200).json(transaction);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});
exports.getTransactionHandler = getTransactionHandler;
const incomingTransactionHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const user = yield (0, transaction_service_1.getUserInfo)(req.params.id);
        console.log(user === null || user === void 0 ? void 0 : user.accountRole);
        if ((user === null || user === void 0 ? void 0 : user.accountRole) === "MANAGER") {
            if (!((_e = user.userInfo) === null || _e === void 0 ? void 0 : _e.assignedDivision)) {
                return res
                    .status(404)
                    .json("Current user was not assigned on any division");
            }
            const transactions = yield (0, transaction_service_1.getIncomingTransactionByManager)(user.accountRole, user.userInfo.assignedDivision);
            return res.status(200).json(transactions);
        }
        return res.status(200).json("some");
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
exports.incomingTransactionHandler = incomingTransactionHandler;
const receivedTransactionHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f, _g, _h, _j;
    const { receivedBy, dateReceived } = req.body;
    const transactionID = req.params.id;
    try {
        const result = yield (0, transaction_service_1.receiveTransactionById)(transactionID, receivedBy, dateReceived);
        const validatedData = transaction_schema_1.transactionData.safeParse(result);
        console.log((_f = validatedData.error) === null || _f === void 0 ? void 0 : _f.errors);
        if (validatedData.error) {
            return res
                .status(http_status_codes_1.StatusCodes.EXPECTATION_FAILED)
                .json("something went wrong!");
        }
        const cleanedData = Object.assign(Object.assign({}, validatedData.data), { company: (_g = validatedData.data.company) === null || _g === void 0 ? void 0 : _g.companyName, project: (_h = validatedData.data.project) === null || _h === void 0 ? void 0 : _h.projectName, forwardedBy: validatedData.data.forwarder.email, attachments: validatedData.data.attachment, receivedBy: ((_j = validatedData.data.receive) === null || _j === void 0 ? void 0 : _j.email) || null, transactionId: validatedData.data.id });
        const { receivedById, receive, forwarder, id } = cleanedData, payload = __rest(cleanedData, ["receivedById", "receive", "forwarder", "id"]);
        yield (0, transaction_service_1.logPostTransactions)(payload);
        res.status(http_status_codes_1.StatusCodes.ACCEPTED).json(validatedData.data.id);
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.CONFLICT).json(error);
    }
});
exports.receivedTransactionHandler = receivedTransactionHandler;
const getTransactionByParamsHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield (0, transaction_service_1.getUserInfo)(id);
        if (!user)
            return res.status(404).json("User not found");
        const result = yield (0, transaction_service_1.getReceivedTransactions)(user.id);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.getTransactionByParamsHandler = getTransactionByParamsHandler;
const getTransactionByParams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { option } = req.query;
    console.log(option);
    const id = req.params.id;
    try {
        const userInfo = yield (0, transaction_service_1.getUserInfo)(id);
        const response = yield (0, transaction_service_1.fetchTransactions)(id, userInfo === null || userInfo === void 0 ? void 0 : userInfo.userInfo.assignedDivision, userInfo === null || userInfo === void 0 ? void 0 : userInfo.accountRole, option);
        console.log(response);
        res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_GATEWAY).json(error);
    }
});
exports.getTransactionByParams = getTransactionByParams;
const forwardTransactionHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _k, _l, _m, _o;
    try {
        const result = yield (0, transaction_service_1.forwardTransaction)(req.body);
        const validatedData = transaction_schema_1.transactionData.safeParse(result);
        console.log((_k = validatedData.error) === null || _k === void 0 ? void 0 : _k.errors);
        if (validatedData.error) {
            return res.status(500).json("something went wrong!");
        }
        console.log(validatedData.data);
        const cleanedData = Object.assign(Object.assign({}, validatedData.data), { company: (_l = validatedData.data.company) === null || _l === void 0 ? void 0 : _l.companyName, project: (_m = validatedData.data.project) === null || _m === void 0 ? void 0 : _m.projectName, forwardedBy: validatedData.data.forwarder.email, attachments: validatedData.data.attachment, receivedBy: ((_o = validatedData.data.receive) === null || _o === void 0 ? void 0 : _o.email) || null, transactionId: validatedData.data.id });
        const { receivedById, receive, forwarder, id } = cleanedData, payload = __rest(cleanedData, ["receivedById", "receive", "forwarder", "id"]);
        const logData = yield (0, transaction_service_1.logPostTransactions)(payload);
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_GATEWAY).json(error);
    }
});
exports.forwardTransactionHandler = forwardTransactionHandler;
