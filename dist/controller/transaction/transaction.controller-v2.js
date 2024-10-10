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
const user_service_1 = require("../user/user.service");
class TransactionController {
    constructor() {
        this.transactionService = new transaction_service_v2_1.TransactionService();
    }
    insertTransactionHandler(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let receiverInfo = null;
                const lastId = yield this.transactionService.getLastId();
                const generatedId = (0, generate_id_1.GenerateId)(lastId);
                const data_payload = Object.assign(Object.assign({}, data), { transactionId: generatedId });
                if (data.status != "ARCHIVED" && data.receiverId) {
                    receiverInfo = yield (0, user_service_1.getUserInfoByAccountId)(data.receiverId);
                }
                const forwarder = yield (0, user_service_1.getUserInfoByAccountId)(data.forwarderId);
                const response = yield prisma_1.db.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    const transaction = yield this.transactionService.insertTransaction(data_payload, tx);
                    const payload = (0, transaction_utils_1.cleanedDataUtils)(transaction, forwarder, receiverInfo);
                    yield this.transactionService.logPostTransaction(payload, tx);
                    return transaction;
                }));
                if (!response)
                    throw new Error("Something went wrong inserting data !");
                if (response.status === "ARCHIVED")
                    return response;
                const notifications = yield this.transactionService.fetchAllNotificationById(response.receiverId);
                const tracker = yield this.transactionService.getIncomingTransaction(response.receiverId);
                const message = "You have new notification";
                const receiverSocketId = __1.userSockets.get(response.receiverId);
                const quantityTracker = {
                    incoming: tracker.incoming,
                    inbox: tracker.outgoing,
                };
                const modified_message = notifications.map((data) => {
                    return Object.assign(Object.assign({}, data), { message: `${forwarder === null || forwarder === void 0 ? void 0 : forwarder.firstName} ${forwarder === null || forwarder === void 0 ? void 0 : forwarder.lastName} ${data.message}` });
                });
                if (receiverSocketId) {
                    __1.io.to(receiverSocketId).emit("notification", message, modified_message, quantityTracker);
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
    // public async fetchAllTransactions(req: Request, res: Response) {
    //   try {
    //     const transactions = await this.transactionService.getTransactionsService();
    //     return res.status(StatusCodes.OK).json(transactions);
    //   } catch (error) {
    //     console.log(error);
    //     return res
    //       .status(StatusCodes.BAD_GATEWAY)
    //       .json("Something went wrong ! ");
    //   }
    // }
    fetchAllTransactions(status, page, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transactions = yield this.transactionService.getTransactionsService(status, page, pageSize);
                return transactions;
            }
            catch (error) {
                throw new Error("something went wrong fetching transactions");
            }
        });
    }
    fetchTransactionByIdHandler(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transaction = yield this.transactionService.getTransactionByIdService(id);
                return transaction;
            }
            catch (error) {
                console.log(error);
                throw new Error("Something went wrong ! ");
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
                return res.status(http_status_codes_1.StatusCodes.BAD_GATEWAY).json("Something went wrong ! ");
            }
        });
    }
    fetchTransactionsByParamsHandler(status, accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (status == "INCOMING") {
                    const response = yield this.transactionService.getIncomingTransactionService(accountId);
                    return response;
                }
                const response = yield this.transactionService.getReceivedTransactionService(accountId);
                return response;
            }
            catch (error) {
                throw new Error("something went wrong fetching transactions by params");
            }
        });
    }
    archivedTransactionHandler(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield prisma_1.db.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    const result = yield this.transactionService.archivedTransactionService(id, userId);
                    const payload = (0, transaction_utils_1.cleanedDataUtils)(result);
                    yield this.transactionService.logPostTransaction(payload, tx);
                    return result;
                }));
                return response;
            }
            catch (error) {
                console.log(error);
                throw new Error("something went wrong fetching transactions by params");
            }
        });
    }
    forwardTransactionHandler(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!data.receiverId || data.receiverId == data.forwarderId)
                    throw new Error("Please forward the transaction ");
                const receiverInfo = yield (0, user_service_1.getUserInfoByAccountId)(data.receiverId);
                const forwarder = yield (0, user_service_1.getUserInfoByAccountId)(data.forwarderId);
                const createAttachment = data.attachments.filter((attachment) => !attachment.id);
                const updateAttachment = data.attachments.filter((attachment) => attachment.id);
                const response = yield prisma_1.db.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    const result = yield this.transactionService.forwardTransactionService(data, createAttachment, updateAttachment, tx);
                    const payload = (0, transaction_utils_1.cleanedDataUtils)(result, forwarder, receiverInfo);
                    yield this.transactionService.logPostTransaction(payload, tx);
                    return result;
                }));
                const notifications = yield this.transactionService.fetchAllNotificationById(response.receiverId);
                const tracker = yield this.transactionService.getIncomingTransaction(response.receiverId);
                const message = "You have a new notification";
                const receiverSocketId = __1.userSockets.get(response.receiverId);
                const quantityTracker = {
                    incoming: tracker.incoming,
                    inbox: tracker.outgoing,
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
    receivedTransactionHandler(id, dateReceived) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.transactionService.receiveTransactionService(id, dateReceived);
                console.log(result);
                yield this.transactionService.receivedLogsService(result.id, result.dateForwarded, result.dateReceived || new Date(), result.receiverId);
                return result;
            }
            catch (error) {
                console.log(error);
                throw new Error("Something went wrong while receiving transactions");
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
                return res.status(http_status_codes_1.StatusCodes.BAD_GATEWAY).json("Something went wrong ! ");
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
                return res.status(http_status_codes_1.StatusCodes.BAD_GATEWAY).json("Something went wrong ! ");
            }
        });
    }
    countIncomingAndInboxTransactions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const tracker = yield this.transactionService.getIncomingTransaction(id);
                res.status(http_status_codes_1.StatusCodes.OK).json({ incoming: tracker.incoming, inbox: tracker.outgoing });
            }
            catch (error) {
                console.log(error);
                res.status(http_status_codes_1.StatusCodes.BAD_GATEWAY).json(error);
            }
        });
    }
    updateCswById(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.transactionService.updateTransactionCswById(id, data);
                return result;
            }
            catch (error) {
                console.log(error);
                throw new Error("something went wrong calling the services");
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
    getSearchedTransation(query, page, pageSize, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transactions = yield this.transactionService.searchTransaction(query, page, pageSize, status);
                if (!transactions)
                    return null;
                return transactions;
            }
            catch (error) {
                throw new Error("Something went wrong searching transactions");
            }
        });
    }
}
exports.TransactionController = TransactionController;
