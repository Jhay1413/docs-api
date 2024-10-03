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
                    data: Object.assign(Object.assign({}, data), { transactionId: data.transactionId, attachments: {
                            createMany: {
                                data: attachments,
                            },
                        } }),
                    include: {
                        attachments: true,
                        company: true,
                        project: true,
                    },
                });
                const modified_transaction = Object.assign(Object.assign({}, createdTransaction), { dueDate: createdTransaction.dueDate.toISOString(), dateForwarded: createdTransaction.dateForwarded.toISOString(), attachments: createdTransaction.attachments.map((data) => {
                        return Object.assign(Object.assign({}, data), { createdAt: data.createdAt.toISOString() });
                    }), dateReceived: null });
                return modified_transaction;
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
                                dateForwarded: "asc",
                            },
                        },
                        attachments: true,
                        completeStaffWork: {
                            omit: {
                                updatedAt: true,
                                createdAt: true,
                            },
                        },
                    },
                });
                console.log(transaction);
                if (!transaction)
                    throw new Error("transaction not found");
                const new_attachments = transaction.attachments.map((data) => {
                    return Object.assign(Object.assign({}, data), { createdAt: data.createdAt.toISOString() });
                });
                const new_csw = transaction.completeStaffWork.map((data) => {
                    return Object.assign(Object.assign({}, data), { date: data.date.toISOString(), transactionId: data.transactionId });
                });
                const parseTransactionLogs = transaction === null || transaction === void 0 ? void 0 : transaction.transactionLogs.map((respo) => {
                    return Object.assign(Object.assign({}, respo), { attachments: JSON.parse(respo.attachments), createdAt: respo.createdAt.toISOString(), updatedAt: respo.updatedAt.toISOString(), dateForwarded: respo.dateForwarded.toISOString(), dueDate: respo.dueDate.toISOString(), dateReceived: respo.dateReceived ? respo.dateReceived.toISOString() : null });
                });
                //  const {transactionLogs, ...transationData} = transaction
                const parseData = Object.assign(Object.assign({}, transaction), { dueDate: transaction.dueDate.toISOString(), dateForwarded: transaction.dateForwarded.toISOString(), dateReceived: transaction.dateReceived ? transaction.dateReceived.toISOString() : null, transactionLogs: parseTransactionLogs, completeStaffWork: new_csw, attachments: new_attachments });
                // const validateData = transactionQueryData.safeParse(parseResponse);
                // if(validateData.error){
                //   console.log(validateData.error.errors)
                //   throw new Error("data not validated")
                // }
                return parseData;
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
                    include: {
                        forwarder: {
                            include: {
                                userInfo: true,
                            },
                        },
                    },
                });
                const returned_data = response.map((data) => {
                    return Object.assign(Object.assign({}, data), { dueDate: data.dueDate.toISOString(), dateForwarded: data.dateForwarded.toISOString(), dateReceived: data.dateReceived ? data.dateReceived.toISOString() : null });
                });
                return returned_data;
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
                    include: {
                        forwarder: {
                            include: {
                                userInfo: true,
                            },
                        },
                    },
                });
                const returned_data = response.map((data) => {
                    return Object.assign(Object.assign({}, data), { dueDate: data.dueDate.toISOString(), dateForwarded: data.dateForwarded.toISOString(), dateReceived: data.dateReceived ? data.dateReceived.toISOString() : null });
                });
                return returned_data;
            }
            catch (error) {
                console.error("Error fetching transaction", error);
                throw new Error("Failed to fetch received transaction");
            }
        });
    }
    getTransactionsService(status, page, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * pageSize;
            console.log(page, pageSize);
            try {
                const transactions = yield prisma_1.db.transaction.findMany({
                    skip,
                    take: pageSize,
                    where: {
                        status: {
                            equals: status,
                        },
                    },
                    include: {
                        forwarder: {
                            include: {
                                userInfo: true,
                            },
                        },
                        receiver: {
                            include: {
                                userInfo: true,
                            },
                        },
                        project: true,
                        company: true,
                        attachments: {
                            omit: {
                                createdAt: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                });
                // Post-process to calculate percentage and combine names
                if (!transactions)
                    return null;
                const processedTransactions = transactions.map((t) => {
                    var _a, _b, _c, _d, _e, _f, _g, _h;
                    const finalAttachmentCount = t.attachments.filter((a) => a.fileStatus === "FINAL_ATTACHMENT").length;
                    const totalAttachmentCount = t.attachments.length;
                    const percentage = totalAttachmentCount ? (finalAttachmentCount * 100) / totalAttachmentCount : 0;
                    return Object.assign(Object.assign({}, t), { dueDate: t.dueDate.toISOString(), dateForwarded: t.dateForwarded.toISOString(), dateReceived: t.dateReceived ? t.dateReceived.toISOString() : null, forwarderName: `${(_b = (_a = t.forwarder) === null || _a === void 0 ? void 0 : _a.userInfo) === null || _b === void 0 ? void 0 : _b.firstName} ${(_d = (_c = t.forwarder) === null || _c === void 0 ? void 0 : _c.userInfo) === null || _d === void 0 ? void 0 : _d.lastName}`, receiverName: `${(_f = (_e = t.receiver) === null || _e === void 0 ? void 0 : _e.userInfo) === null || _f === void 0 ? void 0 : _f.firstName} ${(_h = (_g = t.receiver) === null || _g === void 0 ? void 0 : _g.userInfo) === null || _h === void 0 ? void 0 : _h.lastName}`, percentage: Math.round(percentage).toString() });
                });
                return processedTransactions;
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
                const response = yield prisma_1.db.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    const incoming = yield tx.transaction.count({
                        where: {
                            receiverId: accountId,
                            dateReceived: {
                                equals: null,
                            },
                            status: {
                                not: "ARCHIEVED",
                            },
                        },
                    });
                    const outgoing = yield tx.transaction.count({
                        where: {
                            receiverId: accountId,
                            dateReceived: {
                                not: null,
                            },
                            status: {
                                not: "ARCHIEVED",
                            },
                        },
                    });
                    return { incoming, outgoing };
                }));
                return response;
            }
            catch (error) {
                console.log(error);
                throw new Error("Something went wrong !");
            }
        });
    }
    archivedTransactionService(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield prisma_1.db.transaction.update({
                    where: {
                        id: id,
                    },
                    data: {
                        forwarderId: userId,
                        receiverId: null,
                        dateReceived: null,
                        status: "ARCHIVED",
                    },
                    include: {
                        attachments: true,
                        company: true,
                        project: true,
                        forwarder: {
                            include: {
                                userInfo: true,
                            },
                        },
                        receiver: true,
                    },
                });
                const modified_data = Object.assign(Object.assign({}, result), { dueDate: result.dueDate.toISOString(), dateForwarded: result.dateForwarded.toISOString(), dateReceived: null, attachments: result.attachments.map((data) => {
                        return Object.assign(Object.assign({}, data), { createdAt: data.createdAt.toDateString() });
                    }) });
                return modified_data;
            }
            catch (error) {
                console.log(error);
                throw new Error("Something went wrong !");
            }
        });
    }
    forwardTransactionService(data, createAttachment, updateAttachment, tx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield tx.transaction.update({
                    where: {
                        transactionId: data.transactionId,
                    },
                    data: Object.assign(Object.assign({}, data), { dateReceived: null, attachments: {
                            createMany: {
                                data: createAttachment,
                            },
                            update: updateAttachment.map((attachment) => ({
                                where: {
                                    id: attachment.id,
                                },
                                data: attachment,
                            })),
                        } }),
                    include: {
                        attachments: true,
                        company: true,
                        project: true,
                    },
                });
                const modified_data = Object.assign(Object.assign({}, response), { dueDate: response.dueDate.toISOString(), dateForwarded: response.dateForwarded.toISOString(), dateReceived: null, attachments: response.attachments.map((data) => {
                        return Object.assign(Object.assign({}, data), { createdAt: data.createdAt.toDateString() });
                    }) });
                return modified_data;
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
                        id: id,
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
    receivedLogsService(transactionId, dateForwarded, dateReceived, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(userId, "userId");
                console.log(dateReceived, "dateRecieved");
                console.log(dateForwarded, "date forwarded");
                console.log(transactionId, "transaction ID");
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
                return;
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
                        attachments: {
                            omit: {
                                createdAt: true,
                            },
                        },
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
                console.log(error);
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
                        include: {
                            forwarder: true,
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
                        include: {
                            forwarder: {
                                include: {
                                    userInfo: true,
                                },
                            },
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
    getDashboardPriority() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transactions = yield prisma_1.db.$queryRaw `
      SELECT 
          t.id,
          t."transactionId",
          c."projectName",
          COALESCE(
              ROUND(
                  (SUM(CASE WHEN a."fileStatus" = 'FINAL_ATTACHMENT' THEN 1 ELSE 0 END) * 100.0) / NULLIF(COUNT(a.id), 0)
              ),
              0
          ) AS percentage
      FROM "Transaction" t
      LEFT JOIN "Attachment" a ON t.id = a."transactionId"
      LEFT JOIN "UserAccounts" b ON b.id = t."forwarderId"
      LEFT JOIN "CompanyProject" c ON c.id = t."projectId"
      WHERE t.status <> 'ARCHIVED' AND t.priority = 'HIGH'
      GROUP BY
          t.id,
          t."transactionId",
          c."projectName"
      ORDER BY 
          t."createdAt" DESC
      LIMIT 10;
  `;
                return transactions;
            }
            catch (error) {
                console.error("Error fetching transaction", error);
                throw new Error("Failed to fetch transactions");
            }
        });
    }
    getTotalNumberOfProjects() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transactions = yield prisma_1.db.transaction.count({
                    where: {
                        status: {
                            not: "ARCHIVED",
                        },
                    },
                });
                return transactions;
            }
            catch (error) {
                console.error("Error fetching transaction", error);
                throw new Error("Failed to fetch transactions");
            }
        });
    }
    getNumberPerApplication() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transactions = yield prisma_1.db.transaction.groupBy({
                    by: ["documentSubType"],
                    _count: {
                        id: true,
                    },
                    where: {
                        status: {
                            not: "ARCHIVED",
                        },
                    },
                });
                const countEachType = transactions.map((item) => ({
                    categoryName: item.documentSubType,
                    count: item._count.id,
                }));
                return countEachType;
            }
            catch (error) {
                console.error("Error fetching transaction", error);
                throw new Error("Failed to fetch transactions");
            }
        });
    }
    getNumberPerSection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transactions = yield prisma_1.db.transaction.groupBy({
                    by: ["team"],
                    _count: {
                        id: true,
                    },
                    where: {
                        status: {
                            not: "ARCHIVED",
                        },
                    },
                });
                const data = transactions.map((item) => ({
                    categoryName: item.team,
                    count: item._count.id,
                }));
                return data;
            }
            catch (error) {
                console.error("Error fetching transaction", error);
                throw new Error("Failed to fetch transactions");
            }
        });
    }
    searchTransaction(query, page, pageSize, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * pageSize;
            try {
                const transactions = yield prisma_1.db.transaction.findMany({
                    skip,
                    take: pageSize,
                    where: {
                        status: {
                            equals: status,
                        },
                        AND: [
                            {
                                OR: [
                                    {
                                        company: {
                                            OR: [{ companyName: { contains: query, mode: "insensitive" } }, { companyId: { contains: query, mode: "insensitive" } }],
                                        },
                                    },
                                    {
                                        project: {
                                            OR: [{ projectName: { contains: query, mode: "insensitive" } }, { projectId: { contains: query, mode: "insensitive" } }],
                                        },
                                    },
                                    { team: { contains: query, mode: "insensitive" } },
                                    { transactionId: { contains: query, mode: "insensitive" } },
                                    { documentSubType: { contains: query, mode: "insensitive" } },
                                    { targetDepartment: { contains: query, mode: "insensitive" } },
                                    { status: { contains: query, mode: "insensitive" } },
                                ],
                            },
                        ],
                    },
                    include: {
                        forwarder: {
                            include: {
                                userInfo: true,
                            },
                        },
                        receiver: {
                            include: {
                                userInfo: true,
                            },
                        },
                        project: true,
                        company: true,
                        attachments: {
                            omit: {
                                createdAt: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                });
                // Post-process to calculate percentage and combine names
                if (!transactions)
                    return null;
                const processedTransactions = transactions.map((t) => {
                    var _a, _b, _c, _d, _e, _f, _g, _h;
                    const finalAttachmentCount = t.attachments.filter((a) => a.fileStatus === "FINAL_ATTACHMENT").length;
                    const totalAttachmentCount = t.attachments.length;
                    const percentage = totalAttachmentCount ? (finalAttachmentCount * 100) / totalAttachmentCount : 0;
                    return Object.assign(Object.assign({}, t), { dueDate: t.dueDate.toISOString(), dateForwarded: t.dateForwarded.toISOString(), dateReceived: t.dateReceived ? t.dateReceived.toISOString() : null, forwarderName: `${(_b = (_a = t.forwarder) === null || _a === void 0 ? void 0 : _a.userInfo) === null || _b === void 0 ? void 0 : _b.firstName} ${(_d = (_c = t.forwarder) === null || _c === void 0 ? void 0 : _c.userInfo) === null || _d === void 0 ? void 0 : _d.lastName}`, receiverName: `${(_f = (_e = t.receiver) === null || _e === void 0 ? void 0 : _e.userInfo) === null || _f === void 0 ? void 0 : _f.firstName} ${(_h = (_g = t.receiver) === null || _g === void 0 ? void 0 : _g.userInfo) === null || _h === void 0 ? void 0 : _h.lastName}`, percentage: Math.round(percentage).toString() });
                });
                return processedTransactions;
            }
            catch (error) {
                console.log(error);
                throw new Error("something went wrong while searching");
            }
        });
    }
}
exports.TransactionService = TransactionService;
