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
exports.TransactionController = void 0;
const http_status_codes_1 = require("http-status-codes");
const transaction_service_v2_1 = require("./transaction.service-v2");
const generate_id_1 = require("../../utils/generate-id");
const transaction_utils_1 = require("./transaction.utils");
const prisma_1 = require("../../prisma");
const __1 = require("../..");
const shared_contract_1 = require("shared-contract");
class TransactionController {
    constructor() {
        this.transactionService = new transaction_service_v2_1.TransactionService();
    }
    insertTransactionHandler(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const lastId = yield this.transactionService.getLastId();
                const generatedId = (0, generate_id_1.GenerateId)(lastId);
                const data_payload = Object.assign(Object.assign({}, data), { transactionId: generatedId });
                const response = yield prisma_1.db.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    const transaction = yield this.transactionService.insertTransaction(data_payload, tx);
                    const payload = (0, transaction_utils_1.cleanedDataUtils)(transaction);
                    yield this.transactionService.logPostTransaction(payload, tx);
                    if (transaction.status === "ARCHIVED" || !transaction.receiverId)
                        return;
                    const notificationPayload = {
                        transactionId: transaction.id,
                        message: `New Transaction Forwarded by ${transaction.forwarder.accountRole}`,
                        receiverId: transaction.receiverId,
                        forwarderId: transaction.forwarderId,
                        isRead: false,
                    };
                    yield this.transactionService.addNotificationService(notificationPayload, tx);
                    return transaction;
                }));
                const returnedValidateData = shared_contract_1.transactionQueryData.safeParse(response);
                if (((_a = returnedValidateData.data) === null || _a === void 0 ? void 0 : _a.status) === "ARCHIVED")
                    return response;
                if (returnedValidateData.success) {
                    const notifications = yield this.transactionService.fetchAllNotificationById(returnedValidateData.data.receiverId);
                    const { incomingCount, outgoingCount } = yield this.transactionService.getIncomingTransaction(returnedValidateData.data.receiverId);
                    const message = "You have new notification";
                    const receiverSocketId = __1.userSockets.get(returnedValidateData.data.receiverId);
                    const quantityTracker = {
                        incoming: incomingCount,
                        inbox: outgoingCount,
                    };
                    if (receiverSocketId) {
                        __1.io.to(receiverSocketId).emit("notification", message, notifications, quantityTracker);
                    }
                }
                return response;
            }
            catch (error) {
                console.log(error);
                throw new Error("Something went wrong ! ");
            }
            finally {
                yield prisma_1.db.$disconnect();
            }
        });
    }
    fetchAllTransactions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transactions = yield this.transactionService.getTransactionsService();
                return res.status(http_status_codes_1.StatusCodes.OK).json(transactions);
            }
            catch (error) {
                console.log(error);
                return res
                    .status(http_status_codes_1.StatusCodes.BAD_GATEWAY)
                    .json("Something went wrong ! ");
            }
        });
    }
    fetchTransactionByIdHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const transaction = yield this.transactionService.getTransactionByIdService(id);
                return res.status(http_status_codes_1.StatusCodes.OK).json(transaction);
            }
            catch (error) {
                return res
                    .status(http_status_codes_1.StatusCodes.BAD_GATEWAY)
                    .json("Something went wrong ! ");
            }
        });
    }
    fetchArchivedTransactionHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transactions = yield this.transactionService.getArchivedTransaction();
                res.status(http_status_codes_1.StatusCodes.OK).json(transactions);
            }
            catch (error) {
                return res
                    .status(http_status_codes_1.StatusCodes.BAD_GATEWAY)
                    .json("Something went wrong ! ");
            }
        });
    }
    fetchTransactionsByParamsHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { option } = req.query;
            const { id } = req.params;
            try {
                if (option == "INCOMING") {
                    const response = yield this.transactionService.getIncomingTransactionService(id);
                    return res.status(http_status_codes_1.StatusCodes.OK).json(response);
                }
                else if (option == "INBOX") {
                    const response = yield this.transactionService.getReceivedTransactionService(id);
                    return res.status(http_status_codes_1.StatusCodes.OK).json(response);
                }
            }
            catch (error) {
                return res
                    .status(http_status_codes_1.StatusCodes.BAD_GATEWAY)
                    .json("Something went wrong ! ");
            }
        });
    }
    forwardTransactionHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Start the transaction
                const response = yield prisma_1.db.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b, _c;
                    const result = yield this.transactionService.forwardTransactionService(req.body, tx);
                    const validatedData = shared_contract_1.transactionQueryData.safeParse(result);
                    if (!validatedData.success) {
                        throw new Error("Something went wrong while validating data after forwarding!");
                    }
                    const payload = (0, transaction_utils_1.cleanedDataUtils)(validatedData.data);
                    yield this.transactionService.logPostTransaction(payload, tx);
                    if (result.status === "ARCHIVED" || !result.receiverId) {
                        return result; // Early return if not needing further actions
                    }
                    const notificationPayload = {
                        transactionId: result.id,
                        message: `New Transaction Forwarded by ${(_b = (_a = validatedData.data) === null || _a === void 0 ? void 0 : _a.forwarder) === null || _b === void 0 ? void 0 : _b.accountRole}`,
                        receiverId: validatedData.data.receiverId,
                        forwarderId: (_c = validatedData.data.forwarder) === null || _c === void 0 ? void 0 : _c.id,
                        isRead: false,
                    };
                    yield this.transactionService.addNotificationService(notificationPayload);
                    return validatedData.data;
                }));
                // After the transaction has completed
                if (response.status === "ARCHIVED" || !response.receiverId) {
                    return response;
                }
                const notifications = yield this.transactionService.fetchAllNotificationById(response.receiverId);
                const { incomingCount, outgoingCount } = yield this.transactionService.getIncomingTransaction(response.receiverId);
                const message = "You have a new notification";
                const receiverSocketId = __1.userSockets.get(response.receiverId);
                const quantityTracker = {
                    incoming: incomingCount,
                    inbox: outgoingCount,
                };
                if (receiverSocketId) {
                    __1.io.to(receiverSocketId).emit("notification", message, notifications, quantityTracker);
                }
                return response;
            }
            catch (error) {
                console.error("Error in forwardTransactionHandler:", error);
                throw new Error("Something went wrong ! ");
            }
            finally {
                yield prisma_1.db.$disconnect();
            }
        });
    }
    receivedTransactionHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { dateReceived } = req.body;
            try {
                const result = yield this.transactionService.receiveTransactionService(id, dateReceived);
                yield this.transactionService.receivedLogsService(result.id, result.dateForwarded, result.dateReceived || new Date(), result.receiver.id);
                res.status(http_status_codes_1.StatusCodes.OK).json(result.id);
            }
            catch (error) {
                return res
                    .status(http_status_codes_1.StatusCodes.BAD_GATEWAY)
                    .json("Something went wrong ! ");
            }
        });
    }
    fetchNotificationsHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const notifications = yield this.transactionService.fetchAllNotificationById(id);
                res.status(http_status_codes_1.StatusCodes.OK).json(notifications);
            }
            catch (error) {
                return res
                    .status(http_status_codes_1.StatusCodes.BAD_GATEWAY)
                    .json("Something went wrong ! ");
            }
        });
    }
    readAllNotificationHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                yield this.transactionService.readAllNotificationService(id);
                const notifications = yield this.transactionService.fetchAllNotificationById(id);
                res.status(http_status_codes_1.StatusCodes.OK).json(notifications);
            }
            catch (error) {
                console.log(error);
                return res
                    .status(http_status_codes_1.StatusCodes.BAD_GATEWAY)
                    .json("Something went wrong ! ");
            }
        });
    }
    countIncomingAndInboxTransactions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const { incomingCount, outgoingCount } = yield this.transactionService.getIncomingTransaction(id);
                res
                    .status(http_status_codes_1.StatusCodes.OK)
                    .json({ incoming: incomingCount, inbox: outgoingCount });
            }
            catch (error) {
                console.log(error);
                res.status(http_status_codes_1.StatusCodes.BAD_GATEWAY).json(error);
            }
        });
    }
    updateCswById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const result = yield this.transactionService.updateTransactionCswById(id, req.body);
                res.status(http_status_codes_1.StatusCodes.CREATED).json(result);
            }
            catch (error) {
                res.status(http_status_codes_1.StatusCodes.BAD_GATEWAY).json(error);
            }
        });
    }
    transactionEntities(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.transactionService.getDepartmentEntities();
                res.status(http_status_codes_1.StatusCodes.OK).json(result);
            }
            catch (error) {
                console.log(error);
                res.status(http_status_codes_1.StatusCodes.BAD_GATEWAY).json(error);
            }
        });
    }
    getDashboardData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("asdasdsas");
                const priority = yield this.transactionService.getDashboardPriority();
                const perApplication = yield this.transactionService.getNumberPerApplication();
                const perSection = yield this.transactionService.getNumberPerSection();
                const total = yield this.transactionService.getTotalNumberOfProjects();
                const dashbaordData = [
                    {
                        category: "Priority",
                        data: priority,
                    },
                    {
                        category: "Per Application",
                        data: perApplication,
                    },
                    {
                        category: "Per Section",
                        data: perSection,
                    },
                    {
                        category: "Total Projects",
                        data: total,
                    },
                ];
                res.status(http_status_codes_1.StatusCodes.OK).json(dashbaordData);
            }
            catch (error) {
                console.log(error);
                res.status(http_status_codes_1.StatusCodes.BAD_GATEWAY).json(error);
            }
        });
    }
}
exports.TransactionController = TransactionController;
