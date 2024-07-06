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
exports.fetchTransactions = exports.forwardTransaction = exports.logPostTransactions = exports.getReceivedTransactions = exports.receiveTransactionById = exports.getIncomingTransactionByManager = exports.getUserInfo = exports.getTransactionById = exports.getLastId = exports.getTransactionService = exports.insertTransactionService = void 0;
const prisma_1 = require("../../prisma");
const insertTransactionService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionId, documentType, subject, forwardedTo, remarks, dueDate, forwardedById, forwardedByRole, originDepartment, targetDepartment, dateForwarded, documentSubType, team, projectId, companyId, status, priority, fileData, } = data;
    try {
        const createdTransaction = yield prisma_1.db.transaction.create({
            data: {
                transactionId,
                documentType,
                subject,
                dueDate,
                team,
                status,
                priority,
                projectId,
                companyId,
                documentSubType,
                forwardedTo,
                remarks,
                dateForwarded,
                forwardedById,
                targetDepartment,
                forwardedByRole,
                originDepartment,
                attachments: {
                    createMany: {
                        data: fileData,
                    },
                },
            },
            include: {
                attachments: true,
                forwarder: true,
                receive: true,
                company: true,
                project: true,
            },
        });
        const result = Object.assign(Object.assign({}, createdTransaction), { dueDate: new Date(createdTransaction.dueDate).toISOString(), dateForwarded: new Date(createdTransaction.dateForwarded).toISOString() });
        return result;
    }
    catch (error) {
        console.log(error);
        throw new Error("Error creating transaction");
    }
});
exports.insertTransactionService = insertTransactionService;
const getTransactionService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transaction = yield prisma_1.db.transaction.findMany({
            select: {
                id: true,
                transactionId: true,
                subject: true,
                dueDate: true,
                documentSubType: true,
                documentType: true,
                team: true,
                status: true,
                priority: true,
                remarks: true,
                dateForwarded: true,
                forwardedByRole: true,
                originDepartment: true,
                targetDepartment: true,
                forwardedTo: true,
            },
        });
        return transaction;
    }
    catch (error) {
        console.log(error);
        throw new Error("Error fetching documents");
    }
});
exports.getTransactionService = getTransactionService;
const getLastId = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield prisma_1.db.transaction.findFirst({
            orderBy: {
                createdAt: "desc",
            },
            take: 1,
            select: {
                transactionId: true,
            },
        });
        if (!response) {
            return null;
        }
        return response === null || response === void 0 ? void 0 : response.transactionId;
    }
    catch (error) {
        throw new Error("Error fetching last ID");
    }
});
exports.getLastId = getLastId;
const getTransactionById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield prisma_1.db.transaction.findUnique({
            where: {
                transactionId: id,
            },
            include: {
                company: {
                    include: {
                        contactPersons: true,
                    },
                },
                project: {
                    include: {
                        contactPersons: true,
                    },
                },
                receive: true,
                transactionLogs: true,
            },
        });
        return response;
    }
    catch (error) {
        console.log(error);
        throw new Error("Error fetching transaction");
    }
});
exports.getTransactionById = getTransactionById;
const getUserInfo = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield prisma_1.db.userAccounts.findFirst({
            where: {
                id,
            },
            include: {
                userInfo: true,
            },
        });
        return response;
    }
    catch (error) {
        throw new Error("Error fetching user info on service .");
    }
});
exports.getUserInfo = getUserInfo;
const getIncomingTransactionByManager = (role, department) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield prisma_1.db.transaction.findMany({
            where: {
                forwardedTo: role,
                targetDepartment: department,
                dateReceived: null,
            },
            select: {
                id: true,
                transactionId: true,
                subject: true,
                dueDate: true,
                documentSubType: true,
                documentType: true,
                team: true,
                status: true,
                priority: true,
                remarks: true,
                dateForwarded: true,
                forwardedByRole: true,
                originDepartment: true,
                targetDepartment: true,
                forwardedTo: true,
            },
        });
        console.log(response);
        return response;
    }
    catch (error) {
        throw new Error("Error while fetching incoming transaction");
    }
});
exports.getIncomingTransactionByManager = getIncomingTransactionByManager;
const receiveTransactionById = (id, receivedBy, dateReceived) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield prisma_1.db.transaction.update({
            where: {
                transactionId: id,
            },
            data: {
                receivedById: receivedBy,
                dateReceived: dateReceived,
            },
            include: {
                attachments: true,
                forwarder: true,
                receive: true,
                company: true,
                project: true,
            },
        });
        console.log(response.receive);
        const result = Object.assign(Object.assign({}, response), { dueDate: new Date(response.dueDate).toISOString(), dateForwarded: new Date(response.dateForwarded).toISOString(), dateReceived: new Date(response.dateReceived).toISOString() });
        return result;
    }
    catch (error) {
        throw new Error("Error while receiving transaction .");
    }
});
exports.receiveTransactionById = receiveTransactionById;
const getReceivedTransactions = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield prisma_1.db.transaction.findMany({
            where: {
                receivedById: userId,
            },
            select: {
                id: true,
                transactionId: true,
                subject: true,
                dueDate: true,
                documentSubType: true,
                documentType: true,
                team: true,
                status: true,
                priority: true,
                remarks: true,
                dateForwarded: true,
                forwardedByRole: true,
                originDepartment: true,
                targetDepartment: true,
                forwardedTo: true,
            },
        });
        return response;
    }
    catch (error) { }
});
exports.getReceivedTransactions = getReceivedTransactions;
//For post transaction e. logging/auditing
const logPostTransactions = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const createData = Object.assign(Object.assign({}, data), { transactionId: data.transactionId, dueDate: data.dueDate, dateForwarded: data.dateForwarded });
        if (data.attachments) {
            createData.attachments = {
                connect: data.attachments.map((attachment) => ({
                    id: attachment.id,
                })),
            };
        }
        yield prisma_1.db.transactionLogs.create({
            data: createData,
        });
        return true;
    }
    catch (error) {
        console.log(error);
        throw new Error("something went wrong while adding logs. ");
    }
});
exports.logPostTransactions = logPostTransactions;
//refactor starts here
const forwardTransaction = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { documentType, subject, forwardedTo, remarks, dueDate, forwardedById, forwardedByRole, originDepartment, targetDepartment, dateForwarded, documentSubType, team, transactionId, id, status, priority, } = data;
    console.log(transactionId, id);
    try {
        const response = yield prisma_1.db.transaction.update({
            where: {
                transactionId: data.transactionId,
            },
            data: {
                documentType: documentType,
                documentSubType: documentSubType,
                subject: subject,
                dueDate: dueDate,
                team: team,
                status: status,
                priority: priority,
                forwardedTo: forwardedTo,
                remarks: remarks,
                receivedById: null,
                forwardedById: forwardedById,
                dateForwarded: dateForwarded,
                dateReceived: null,
                originDepartment: originDepartment,
                targetDepartment: targetDepartment,
                forwardedByRole: forwardedByRole,
            },
            include: {
                attachments: true,
                forwarder: true,
                receive: true,
                company: true,
                project: true,
            },
        });
        const result = Object.assign(Object.assign({}, response), { dueDate: new Date(response.dueDate).toISOString(), dateForwarded: new Date(response.dateForwarded).toISOString(), dateReceived: new Date(response.dateReceived).toISOString() });
        return result;
    }
    catch (error) {
        console.log(error);
        throw new Error("something went wrong while updating transaction ");
    }
});
exports.forwardTransaction = forwardTransaction;
const fetchTransactions = (accountId, department, role, option, section, transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    let filters = {};
    const adminRole = ["MANAGER", "RECORDS"];
    const commonRole = ["TL", "CH"];
    console.log(role);
    try {
        if (adminRole.includes(role)) {
            filters = Object.assign({ targetDepartment: department, forwardedTo: role }, (option === "INCOMING"
                ? { dateReceived: null }
                : { receivedById: accountId }));
        }
        else if (commonRole.includes(role)) {
            filters = Object.assign({ team: section, forwardedTo: role }, (option === "INCOMING"
                ? { dateReceived: null }
                : { receivedById: accountId }));
        }
        else {
            filters = {
                id: transactionId,
            };
        }
        const response = yield prisma_1.db.transaction.findMany({
            where: filters,
            select: {
                id: true,
                transactionId: true,
                subject: true,
                dueDate: true,
                documentSubType: true,
                documentType: true,
                team: true,
                status: true,
                priority: true,
                remarks: true,
                dateForwarded: true,
                forwardedByRole: true,
                originDepartment: true,
                targetDepartment: true,
                forwardedTo: true,
            },
        });
        return response;
    }
    catch (error) {
        console.log(error);
        throw new Error("something went wrong while fetching transaction. ");
    }
});
exports.fetchTransactions = fetchTransactions;
