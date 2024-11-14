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
exports.TicketingController = void 0;
const ticketing_service_v1_1 = require("./ticketing.service-v1");
const client_1 = require("@prisma/client");
const prisma_1 = require("../../prisma");
const generate_id_1 = require("../../utils/generate-id");
const prisma = new client_1.PrismaClient();
class TicketingController {
    constructor() {
        this.ticketingService = new ticketing_service_v1_1.TicketingService(prisma);
    }
    createTicket(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lastId = yield this.ticketingService.getLastId();
                const generatedId = (0, generate_id_1.GenerateId)(lastId, "ticket");
                const data_payload = Object.assign(Object.assign({}, data), { ticketId: generatedId });
                const response = yield prisma_1.db.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    const result = yield this.ticketingService.insertTicket(data_payload, tx);
                    yield this.ticketingService.logPostTicket(result, tx);
                    return result;
                }));
            }
            catch (err) {
                console.log(err);
                throw new Error("Something went wrong.");
            }
        });
    }
    fetchTickets(status, page, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tickets = yield this.ticketingService.fetchTickets(status, page, pageSize);
                return tickets;
            }
            catch (error) {
                console.error("Failed to fetch tickets:", error);
                throw new Error("Failed to fetch tickets");
            }
        });
    }
    getTicketsForUserByStatusHandler(userId, status, page, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tickets = yield this.ticketingService.getTicketsForUserByStatusService(userId, status, page, pageSize);
                return tickets;
            }
            catch (error) {
                console.error("Failed to fetch tickets:", error);
                throw new Error("Failed to fetch tickets");
            }
        });
    }
    fetchTicketById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ticket = yield this.ticketingService.fetchTicketByIdService(id);
                return ticket;
            }
            catch (error) {
                console.error("Failed to fetch ticket by ID:", error);
                throw new Error("Something went wrong");
            }
        });
    }
    updateTicket(ticketId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield prisma_1.db.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    const result = yield this.ticketingService.updateTicket(ticketId, data, tx);
                    yield this.ticketingService.logPostTicket(result, tx);
                    return result;
                }));
            }
            catch (err) {
                console.log(err);
                throw new Error("Something went wrong.");
            }
        });
    }
    receiveTicketHandler(ticketId, dateReceived) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield prisma_1.db.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    const result = yield this.ticketingService.receiveTicketService(ticketId, dateReceived, tx);
                    yield this.ticketingService.receiveTicketLog(result.id, result.receiverId, result.senderId, result.dateForwarded, dateReceived);
                }));
                return {
                    message: "Ticket Received!"
                };
            }
            catch (error) {
                console.log(error);
                throw new Error("Something went wrong.");
            }
        });
    }
    updateTicketHandler(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield prisma_1.db.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    const result = yield this.ticketingService.updateTicket(id, data, tx);
                    yield this.ticketingService.logPostTicket(result, tx);
                }));
                return {
                    message: "Ticket updated successfully"
                };
            }
            catch (error) {
                console.error("Error in updateTicketHandler:", error);
                throw new Error("Something went wrong while updating the ticket");
            }
        });
    }
    resolveTicketHandler(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield prisma_1.db.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    const result = yield this.ticketingService.resolveTicketService(id, userId);
                    yield this.ticketingService.logPostTicket(result, tx);
                    return {
                        message: "Ticket resolved successfully"
                    };
                }));
            }
            catch (error) {
                console.log(error);
                throw new Error("Something went wrong");
            }
        });
    }
    reopenTicketHandler(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield prisma_1.db.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    const result = yield this.ticketingService.reopenTicketService(id, userId);
                    yield this.ticketingService.logPostTicket(result, tx);
                    return {
                        message: "Ticket reopened successfully"
                    };
                }));
            }
            catch (error) {
                console.log(error);
                throw new Error("Something went wrong");
            }
        });
    }
}
exports.TicketingController = TicketingController;
