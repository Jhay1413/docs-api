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
exports.TicketingService = void 0;
const prisma_1 = require("../../prisma");
const utils_1 = require("../../utils/utils");
class TicketingService {
    constructor(db) {
        this.db = db;
    }
    insertTicket(data, tx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            try {
                const response = yield tx.ticket.create({
                    data: data,
                    include: {
                        sender: {
                            select: {
                                userInfo: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                    },
                                },
                            },
                        },
                        receiver: {
                            select: {
                                userInfo: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                    },
                                },
                            },
                        },
                    },
                });
                const logs = Object.assign(Object.assign({}, response), { ticketId: response.id, sender: `${(_a = response.sender.userInfo) === null || _a === void 0 ? void 0 : _a.firstName} ${(_b = response.sender.userInfo) === null || _b === void 0 ? void 0 : _b.lastName}`, receiver: `${(_d = (_c = response.receiver) === null || _c === void 0 ? void 0 : _c.userInfo) === null || _d === void 0 ? void 0 : _d.firstName} ${(_f = (_e = response.receiver) === null || _e === void 0 ? void 0 : _e.userInfo) === null || _f === void 0 ? void 0 : _f.lastName}`, senderId: response.senderId, receiverId: response.receiverId, dateForwarded: response.dateForwarded.toISOString(), dateReceived: ((_g = response.dateReceived) === null || _g === void 0 ? void 0 : _g.toISOString()) || null, createdAt: response.createdAt.toISOString(), updatedAt: response.updatedAt.toISOString(), attachments: response.attachments });
                return logs;
            }
            catch (error) {
                console.log(error);
                throw new Error("Something went wrong");
            }
        });
    }
    receiveTicketLog(ticketId, receiverId, senderId, dateForwarded, datReceived) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield prisma_1.db.ticketLogs.update({
                    where: {
                        refId: {
                            ticketId: ticketId,
                            receiverId: receiverId,
                            senderId: senderId,
                            dateForwarded: dateForwarded,
                        },
                    },
                    data: {
                        dateReceived: datReceived,
                    },
                });
                return response;
            }
            catch (error) {
                console.log(error);
                throw new Error("Something went wrong!");
            }
        });
    }
    logPostTicket(data, tx) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(data);
            try {
                const logEntry = yield tx.ticketLogs.create({
                    data: {
                        ticketId: data.ticketId,
                        status: data.status,
                        priority: data.priority,
                        remarks: data.remarks || null,
                        dateForwarded: new Date(data.dateForwarded),
                        dateReceived: data.dateReceived ? new Date(data.dateReceived) : null,
                        sender: data.sender,
                        receiver: data.receiver,
                        senderId: data.senderId,
                        receiverId: data.receiverId,
                        attachments: data.attachments,
                    },
                });
                return logEntry;
            }
            catch (error) {
                console.error("Error creating log entry:", error);
                throw new Error("Failed to log ticket update.");
            }
        });
    }
    fetchTickets(query, page, pageSize, status, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * pageSize;
            let condition = {};
            if (status) {
                if (status === "ARCHIVED") {
                    condition = {
                        status: {
                            equals: status,
                        },
                    };
                }
                else {
                    condition = {
                        status: {
                            not: "ARCHIVED",
                        },
                    };
                }
            }
            try {
                const tickets = yield prisma_1.db.ticket.findMany({
                    skip,
                    take: pageSize,
                    where: {
                        AND: [
                            condition,
                            {
                                OR: [
                                    { subject: { contains: query, mode: "insensitive" } },
                                    { section: { contains: query, mode: "insensitive" } },
                                    { status: { contains: query, mode: "insensitive" } },
                                    { priority: { contains: query, mode: "insensitive" } },
                                    { requestDetails: { contains: query, mode: "insensitive" } },
                                    { ticketId: { contains: query, mode: "insensitive" } },
                                ],
                            },
                        ],
                    },
                    include: {
                        receiver: {
                            include: {
                                userInfo: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                    },
                                },
                            },
                        },
                        sender: {
                            include: {
                                userInfo: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                    },
                                },
                            },
                        },
                        project: true,
                        transaction: true,
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                });
                const formattedTickets = tickets.map((ticket) => {
                    var _a, _b, _c;
                    return Object.assign(Object.assign({}, ticket), { receiver: ticket.receiver ? { firstName: (_a = ticket.receiver) === null || _a === void 0 ? void 0 : _a.userInfo.firstName, lastName: (_b = ticket.receiver) === null || _b === void 0 ? void 0 : _b.userInfo.lastName } : null, sender: { firstName: ticket.sender.userInfo.firstName, lastName: ticket.sender.userInfo.lastName }, dueDate: ticket.dueDate.toISOString(), createdAt: ticket.createdAt.toISOString(), updatedAt: ticket.updatedAt.toISOString(), dateForwarded: ticket.dateForwarded.toISOString(), dateReceived: ((_c = ticket.dateReceived) === null || _c === void 0 ? void 0 : _c.toISOString()) || null });
                });
                return formattedTickets;
            }
            catch (error) {
                console.log("Something went wrong while fetching tickets.", error);
                throw new Error("Something went wrong while searching");
            }
        });
    }
    fetchTicketByIdService(ticketId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const ticket = yield prisma_1.db.ticket.findUnique({
                    where: { id: ticketId },
                    include: {
                        receiver: {
                            include: {
                                userInfo: true,
                            },
                        },
                        sender: {
                            include: {
                                userInfo: true,
                            },
                        },
                        requestee: {
                            include: {
                                userInfo: true,
                            },
                        },
                        project: true,
                        transaction: {
                            select: {
                                transactionId: true,
                                documentSubType: true,
                                status: true,
                                priority: true,
                                dueDate: true,
                            }
                        },
                        ticketLogs: true,
                    },
                });
                if (!ticket) {
                    throw new Error("Ticket not found");
                }
                const formattedTicketLogs = ticket.ticketLogs.map((log) => {
                    var _a;
                    return Object.assign(Object.assign({}, log), { receiver: log.receiver, dateForwarded: log.dateForwarded.toISOString(), dateReceived: ((_a = log.dateReceived) === null || _a === void 0 ? void 0 : _a.toISOString()) || null, createdAt: log.createdAt.toISOString(), updatedAt: log.updatedAt.toISOString() });
                });
                const formattedTicket = Object.assign(Object.assign({}, ticket), { dueDate: ticket.dueDate.toISOString(), dateForwarded: ticket.dateForwarded.toISOString(), dateReceived: ((_a = ticket.dateReceived) === null || _a === void 0 ? void 0 : _a.toISOString()) || null, transaction: ticket.transaction
                        ? {
                            transactionId: ticket.transaction.transactionId,
                            documentSubType: ticket.transaction.documentSubType,
                            status: ticket.transaction.status,
                            priority: ticket.transaction.priority,
                            dueDate: ticket.transaction.dueDate.toISOString(),
                        }
                        : null, ticketLogs: formattedTicketLogs });
                return formattedTicket;
            }
            catch (error) {
                console.error("Failed to fetch ticket:", error);
                throw new Error("Something went wrong");
            }
        });
    }
    getTicketsForUserByStatusService(userId, status, page, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * pageSize;
            const whereCondition = (0, utils_1.StatusCheckerForQueries)(userId, status);
            try {
                const tickets = yield prisma_1.db.ticket.findMany({
                    skip,
                    take: pageSize,
                    where: whereCondition,
                    include: {
                        receiver: {
                            include: {
                                userInfo: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                    },
                                },
                            },
                        },
                        sender: {
                            include: {
                                userInfo: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                    },
                                },
                            },
                        },
                        project: true,
                        transaction: true,
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                });
                const formattedTickets = tickets.map((ticket) => {
                    var _a;
                    return Object.assign(Object.assign({}, ticket), { receiverId: ticket.receiverId || null, receiver: ticket.receiver
                            ? {
                                firstName: ticket.receiver.userInfo.firstName,
                                lastName: ticket.receiver.userInfo.lastName,
                            }
                            : null, sender: {
                            firstName: ticket.sender.userInfo.firstName,
                            lastName: ticket.sender.userInfo.lastName,
                        }, dueDate: ticket.dueDate.toISOString(), createdAt: ticket.createdAt.toISOString(), updatedAt: ticket.updatedAt.toISOString(), dateForwarded: ticket.dateForwarded.toISOString(), dateReceived: ((_a = ticket.dateReceived) === null || _a === void 0 ? void 0 : _a.toISOString()) || null });
                });
                console.log(tickets);
                return formattedTickets;
            }
            catch (error) {
                console.error("Failed to fetch ticket:", error);
                throw new Error("Something went wrong");
            }
        });
    }
    updateTicket(ticketId, data, tx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            const { id } = data, new_data = __rest(data, ["id"]);
            try {
                const result = yield tx.ticket.update({
                    where: { id: ticketId },
                    data: new_data,
                    select: {
                        id: true,
                        ticketId: true,
                        status: true,
                        priority: true,
                        remarks: true,
                        dateForwarded: true,
                        dateReceived: true,
                        sender: {
                            select: {
                                userInfo: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                    },
                                },
                            },
                        },
                        receiver: {
                            select: {
                                userInfo: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                    },
                                },
                            },
                        },
                        receiverId: true,
                        senderId: true,
                        createdAt: true,
                        updatedAt: true,
                        attachments: true,
                    },
                });
                const logs = Object.assign(Object.assign({}, result), { ticketId: result.id, sender: `${(_a = result.sender.userInfo) === null || _a === void 0 ? void 0 : _a.firstName} ${(_b = result.sender.userInfo) === null || _b === void 0 ? void 0 : _b.lastName}`, receiver: `${(_d = (_c = result.receiver) === null || _c === void 0 ? void 0 : _c.userInfo) === null || _d === void 0 ? void 0 : _d.firstName} ${(_f = (_e = result.receiver) === null || _e === void 0 ? void 0 : _e.userInfo) === null || _f === void 0 ? void 0 : _f.lastName}` || null, senderId: result.senderId, receiverId: result.receiverId || null, dateForwarded: result.dateForwarded.toISOString(), dateReceived: ((_g = result.dateReceived) === null || _g === void 0 ? void 0 : _g.toISOString()) || null, createdAt: result.createdAt.toISOString(), updatedAt: result.updatedAt.toISOString() });
                return logs;
            }
            catch (error) {
                console.error("Failed to update ticket:", error);
                throw new Error("Failed to update ticket");
            }
        });
    }
    receiveTicketService(id, dateReceived, tx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            try {
                const response = yield prisma_1.db.ticket.update({
                    where: {
                        id: id,
                    },
                    data: {
                        dateReceived: dateReceived,
                    },
                    select: {
                        id: true,
                        ticketId: true,
                        status: true,
                        priority: true,
                        remarks: true,
                        dateForwarded: true,
                        dateReceived: true,
                        sender: {
                            select: {
                                userInfo: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                    },
                                },
                            },
                        },
                        receiver: {
                            select: {
                                userInfo: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                    },
                                },
                            },
                        },
                        receiverId: true,
                        senderId: true,
                        createdAt: true,
                        updatedAt: true,
                        attachments: true,
                    },
                });
                const logs = Object.assign(Object.assign({}, response), { sender: `${(_a = response.sender.userInfo) === null || _a === void 0 ? void 0 : _a.firstName} ${(_b = response.sender.userInfo) === null || _b === void 0 ? void 0 : _b.lastName}`, receiver: `${(_d = (_c = response.receiver) === null || _c === void 0 ? void 0 : _c.userInfo) === null || _d === void 0 ? void 0 : _d.firstName} ${(_f = (_e = response.receiver) === null || _e === void 0 ? void 0 : _e.userInfo) === null || _f === void 0 ? void 0 : _f.lastName}` || null, dateForwarded: response.dateForwarded.toISOString(), dateReceived: ((_g = response.dateReceived) === null || _g === void 0 ? void 0 : _g.toISOString()) || null, createdAt: response.createdAt.toISOString(), updatedAt: response.updatedAt.toISOString() });
                return logs;
            }
            catch (error) {
                console.error("Failed to receive ticket:", error);
                throw new Error("Something went wrong");
            }
        });
    }
    resolveTicketService(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            try {
                const resolvedTicket = yield prisma_1.db.ticket.update({
                    where: {
                        id: id,
                    },
                    data: {
                        senderId: userId,
                        receiverId: null,
                        dateReceived: null,
                        status: "ARCHIVED",
                    },
                    include: {
                        project: true,
                        transaction: true,
                        sender: {
                            include: {
                                userInfo: true,
                            },
                        },
                        receiver: {
                            include: {
                                userInfo: true,
                            },
                        },
                    },
                });
                const formattedData = Object.assign(Object.assign({}, resolvedTicket), { ticketId: resolvedTicket.id, sender: `${(_a = resolvedTicket.sender.userInfo) === null || _a === void 0 ? void 0 : _a.firstName} ${(_b = resolvedTicket.sender.userInfo) === null || _b === void 0 ? void 0 : _b.lastName}`, senderId: resolvedTicket.senderId, receiver: `${(_d = (_c = resolvedTicket.receiver) === null || _c === void 0 ? void 0 : _c.userInfo) === null || _d === void 0 ? void 0 : _d.firstName} ${(_f = (_e = resolvedTicket.receiver) === null || _e === void 0 ? void 0 : _e.userInfo) === null || _f === void 0 ? void 0 : _f.lastName}`, receiverId: null, dateForwarded: resolvedTicket.dateForwarded.toISOString(), dateReceived: null, createdAt: resolvedTicket.createdAt.toISOString(), updatedAt: resolvedTicket.updatedAt.toISOString(), attachments: resolvedTicket.attachments });
                return formattedData;
            }
            catch (error) {
                console.log(error);
                throw new Error("Something went wrong");
            }
        });
    }
    reopenTicketService(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            try {
                const reopenTicket = yield prisma_1.db.ticket.update({
                    where: {
                        id: id,
                    },
                    data: {
                        status: "REOPENED",
                    },
                    include: {
                        project: true,
                        transaction: true,
                        sender: {
                            include: {
                                userInfo: true,
                            },
                        },
                        receiver: {
                            include: {
                                userInfo: true,
                            },
                        },
                    },
                });
                const formattedData = Object.assign(Object.assign({}, reopenTicket), { ticketId: reopenTicket.id, sender: `${(_a = reopenTicket.sender.userInfo) === null || _a === void 0 ? void 0 : _a.firstName} ${(_b = reopenTicket.sender.userInfo) === null || _b === void 0 ? void 0 : _b.lastName}`, receiver: `${(_d = (_c = reopenTicket.receiver) === null || _c === void 0 ? void 0 : _c.userInfo) === null || _d === void 0 ? void 0 : _d.firstName} ${(_f = (_e = reopenTicket.receiver) === null || _e === void 0 ? void 0 : _e.userInfo) === null || _f === void 0 ? void 0 : _f.lastName}` || null, dateForwarded: reopenTicket.dateForwarded.toISOString(), dateReceived: null, createdAt: reopenTicket.createdAt.toISOString(), updatedAt: reopenTicket.updatedAt.toISOString(), attachments: reopenTicket.attachments });
                return formattedData;
            }
            catch (error) {
                console.log(error);
                throw new Error("Something went wrong");
            }
        });
    }
    getLastId() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield prisma_1.db.ticket.findFirst({
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 1,
                    select: {
                        ticketId: true,
                    },
                });
                if (!response) {
                    return null;
                }
                return response === null || response === void 0 ? void 0 : response.ticketId;
            }
            catch (error) {
                throw new Error("Error fetching last ID");
            }
        });
    }
}
exports.TicketingService = TicketingService;
