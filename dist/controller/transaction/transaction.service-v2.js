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
exports.TransactionService = void 0;
const prisma_1 = require("../../prisma");
class TransactionService {
    insertTransaction(data, tx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { transactionId, documentType, subject, receiverId, remarks, dueDate, forwarderId, originDepartment, targetDepartment, dateForwarded, documentSubType, team, projectId, companyId, status, priority, attachments, } = data;
            try {
                const createdTransaction = yield tx.transaction.create({
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
                        receiverId,
                        remarks,
                        dateForwarded,
                        forwarderId,
                        targetDepartment,
                        originDepartment,
                        attachments: {
                            createMany: {
                                data: attachments,
                            },
                        },
                    },
                    include: {
                        attachments: true,
                        forwarder: true,
                        receiver: true,
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
    }
    getTransactionByIdService(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transaction = yield prisma_1.db.transaction.findUnique({
                    where: {
                        id: id,
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
                        receiver: true,
                        forwarder: true,
                        transactionLogs: {
                            orderBy: {
                                createdAt: "asc",
                            },
                        },
                        attachments: true,
                        completeStaffWork: true,
                    },
                });
                const parseResponse = transaction === null || transaction === void 0 ? void 0 : transaction.transactionLogs.map((respo) => {
                    return Object.assign(Object.assign({}, respo), { attachments: JSON.parse(respo.attachments) });
                });
                return Object.assign(Object.assign({}, transaction), { transactionLogs: parseResponse });
            }
            catch (error) {
                console.error("Error fetching transaction", error);
                throw new Error("Failed to fetch transaction");
            }
        });
    }
    getIncomingTransactionService(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield prisma_1.db.transaction.findMany({
                    where: {
                        receiverId: id,
                        dateReceived: {
                            equals: null,
                        },
                        status: {
                            not: "ARCHIEVED",
                        },
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                });
                return response;
            }
            catch (error) {
                console.error("Error fetching transaction", error);
                throw new Error("Failed to fetch Incoming transaction");
            }
        });
    }
    getReceivedTransactionService(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield prisma_1.db.transaction.findMany({
                    where: {
                        receiverId: id,
                        dateReceived: {
                            not: null,
                        },
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                });
                return response;
            }
            catch (error) {
                console.error("Error fetching transaction", error);
                throw new Error("Failed to fetch received transaction");
            }
        });
    }
    getTransactionsService() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transactions = yield prisma_1.db.$queryRaw `
        SELECT 
            t.id,
            t."transactionId",
            t."documentType",
            t.subject,
            t."dueDate",
            t."createdAt",
            t."updatedAt",
            t."documentSubType",
            t."originDepartment",
            t."targetDepartment",
            t."dateForwarded",
            c."projectName",
            b."accountRole",
            t.status,
            t.priority,
            COALESCE(
                ROUND((SUM(CASE WHEN a."fileStatus" = 'FINAL_ATTACHMENT' THEN 1 ELSE 0 END) * 100.0) / NULLIF(COUNT(a.id), 0)),
                0
            ) AS percentage
        FROM "Transaction" t
        LEFT JOIN "Attachment" a ON t.id = a."transactionId"
        LEFT JOIN "UserAccounts" b ON b.id = t."forwarderId"
        LEFT JOIN "CompanyProject" c on c.id = t."projectId"
        GROUP BY
          t.id,
          t."transactionId",
          t."documentType",
          t.subject,
          t."dueDate",
          t."createdAt",
          t."updatedAt",
          t."documentSubType",
          t."originDepartment",
          t."targetDepartment",
          t."dateForwarded",
          b."accountRole",
          t.status,
          t.priority,
          c."projectName"
          ORDER BY 
          t."createdAt" DESC`;
                return transactions;
            }
            catch (error) {
                console.error("Error fetching transaction", error);
                throw new Error("Failed to fetch transactions");
            }
        });
    }
    getArchivedTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield prisma_1.db.transaction.findMany({
                    where: {
                        status: "ARCHIVED",
                    },
                    select: {
                        id: true,
                        transactionId: true,
                        company: true,
                        project: true,
                        documentSubType: true,
                        createdAt: true,
                        remarks: true,
                    },
                });
                return response;
            }
            catch (error) {
                console.log(error);
                throw new Error("Failed to fetch archieved transactions ! ");
            }
        });
    }
    getIncomingTransaction(accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [incomingCount, outgoingCount] = yield Promise.all([
                    prisma_1.db.transaction.count({
                        where: {
                            receiverId: accountId,
                            dateReceived: {
                                equals: null,
                            },
                            status: {
                                not: "ARCHIEVED",
                            },
                        },
                    }),
                    prisma_1.db.transaction.count({
                        where: {
                            receiverId: accountId,
                            dateReceived: {
                                not: null,
                            },
                            status: {
                                not: "ARCHIEVED",
                            },
                        },
                    }),
                ]);
                return {
                    incomingCount,
                    outgoingCount,
                };
            }
            catch (error) {
                console.log(error);
                throw new Error("Something went wrong !");
            }
        });
    }
    forwardTransactionService(data, tx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { documentType, subject, receiverId, remarks, dueDate, forwarderId, originDepartment, targetDepartment, dateForwarded, documentSubType, team, transactionId, id, status, priority, attachments, } = data;
            try {
                const createAttachment = attachments.filter((attachment) => !attachment.id);
                const updateAttachment = attachments.filter((attachment) => attachment.id);
                const response = yield tx.transaction.update({
                    where: {
                        transactionId: transactionId,
                    },
                    data: {
                        documentType: documentType,
                        documentSubType: documentSubType,
                        subject: subject,
                        dueDate: dueDate,
                        team: team,
                        status: status,
                        priority: priority,
                        forwarderId,
                        remarks: remarks,
                        receiverId,
                        dateForwarded: dateForwarded,
                        dateReceived: null,
                        originDepartment: originDepartment,
                        targetDepartment: targetDepartment,
                        attachments: {
                            createMany: {
                                data: createAttachment,
                            },
                            update: updateAttachment.map((attachment) => ({
                                where: {
                                    id: attachment.id,
                                },
                                data: attachment,
                            })),
                        },
                    },
                    include: {
                        attachments: true,
                        forwarder: true,
                        receiver: true,
                        company: true,
                        project: true,
                    },
                });
                const result = Object.assign(Object.assign({}, response), { dueDate: new Date(response.dueDate).toISOString(), dateForwarded: new Date(response.dateForwarded).toISOString(), dateReceived: response.dateReceived
                        ? new Date(response.dateReceived).toISOString()
                        : null });
                return result;
            }
            catch (error) {
                console.log(error);
                throw new Error("something went wrong while updating transaction ");
            }
        });
    }
    receiveTransactionService(id, dateReceived) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield prisma_1.db.transaction.update({
                    where: {
                        transactionId: id,
                    },
                    data: {
                        dateReceived: dateReceived,
                    },
                    include: {
                        attachments: true,
                        forwarder: true,
                        receiver: true,
                        company: true,
                        project: true,
                    },
                });
                return response;
            }
            catch (error) {
                throw new Error("Error while receiving transaction .");
            }
        });
    }
    receivedLogsService(transactionId, dateForwarded, dateReceived, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield prisma_1.db.transactionLogs.update({
                    where: {
                        refId: {
                            transactionId: transactionId,
                            receiverId: userId,
                            dateForwarded: dateForwarded,
                        },
                    },
                    data: {
                        dateReceived: dateReceived,
                    },
                });
                return response;
            }
            catch (error) {
                console.log(error);
                throw new Error("Error while receiving transaction .");
            }
        });
    }
    logPostTransaction(data, tx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createData = Object.assign(Object.assign({}, data), { transactionId: data.transactionId, dueDate: data.dueDate, dateForwarded: data.dateForwarded, attachments: JSON.stringify(data.attachments) });
                yield tx.transactionLogs.create({
                    data: createData,
                });
                return true;
            }
            catch (error) {
                console.log(error);
                throw new Error("something went wrong while adding logs. ");
            }
        });
    }
    updateTransactionCswById(transactionId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield prisma_1.db.transaction.update({
                    where: {
                        id: transactionId,
                    },
                    data: {
                        completeStaffWork: {
                            upsert: {
                                where: {
                                    id: data.id || "",
                                },
                                update: {
                                    date: data.date,
                                    remarks: data.remarks,
                                    attachmentUrl: data.attachmentUrl,
                                },
                                create: {
                                    date: data.date,
                                    remarks: data.remarks,
                                    attachmentUrl: data.attachmentUrl,
                                },
                            },
                        },
                    },
                    include: {
                        attachments: true,
                        forwarder: true,
                        receiver: true,
                        company: true,
                        project: true,
                        completeStaffWork: true,
                    },
                });
                return response;
            }
            catch (error) {
                console.log(error);
                throw new Error("Something went wrong while adding csw ! ");
            }
        });
    }
    getDepartmentEntities() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Adsadsad12312321");
                const transactions = yield prisma_1.db.$queryRaw `
      SELECT 
        t.id,
        t."accountRole" as Role,
        t."email",
        a."assignedDivision" as Division,
        a."assignedSection" as Section,
        a."assignedPosition" as Position,
        CONCAT(a."firstName", ' - ', a."lastName",'-',t."accountRole") AS Fullname
      FROM "UserAccounts" t 
      LEFT JOIN "UserInfo" a ON t.id = a."accountId"
              `;
                return transactions;
            }
            catch (error) {
                console.log(error);
                throw new Error("Something went wrong while fetching entities! ");
            }
        });
    }
    getLastId() {
        return __awaiter(this, void 0, void 0, function* () {
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
    }
    getUserInfo(id) {
        return __awaiter(this, void 0, void 0, function* () {
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
    }
    addNotificationService(data, tx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response;
                if (tx) {
                    response = yield tx.notification.create({
                        data,
                        include: {},
                    });
                }
                else {
                    response = yield prisma_1.db.notification.create({
                        data,
                        include: {},
                    });
                }
                return response;
            }
            catch (error) {
                throw new Error("Error inserting notification");
            }
        });
    }
    fetchAllNotificationById(id, tx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response;
                if (tx) {
                    response = yield tx.notification.findMany({
                        where: {
                            receiverId: id,
                        },
                        orderBy: {
                            createdAt: "desc", // or 'desc'
                        },
                    });
                }
                else {
                    response = yield prisma_1.db.notification.findMany({
                        where: {
                            receiverId: id,
                        },
                        orderBy: {
                            createdAt: "desc", // or 'desc'
                        },
                    });
                }
                return response;
            }
            catch (error) {
                console.log(error);
                throw new Error("Error fetching notification !");
            }
        });
    }
    readAllNotificationService(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield prisma_1.db.notification.updateMany({
                    where: {
                        receiverId: id,
                    },
                    data: {
                        isRead: true,
                    },
                });
                return;
            }
            catch (error) {
                console.log(error);
                throw new Error("Something went wrong on read notification");
            }
        });
    }
}
exports.TransactionService = TransactionService;
