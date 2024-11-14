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
exports.registerTicketingRoutes = void 0;
const express_1 = require("@ts-rest/express");
const shared_contract_1 = require("shared-contract");
const ticketing_controller_v1_1 = require("./ticketing.controller-v1");
const ts_rest_server_1 = __importDefault(require("../../utils/ts-rest-server"));
const ticketingController = new ticketing_controller_v1_1.TicketingController();
const ticketingRouter = ts_rest_server_1.default.router(shared_contract_1.contracts.ticketing, {
    getTickets: (_a) => __awaiter(void 0, [_a], void 0, function* ({ query }) {
        try {
            const page = parseInt(query.page, 10);
            const pageSize = parseInt(query.pageSize, 10);
            const result = yield ticketingController.fetchTickets(query.query, page, pageSize);
            return {
                status: 200,
                body: result,
            };
        }
        catch (error) {
            return {
                status: 500,
                body: {
                    error: "Something went wrong while fetching tickets.",
                },
            };
        }
    }),
    getTicketsById: (_b) => __awaiter(void 0, [_b], void 0, function* ({ params }) {
        try {
            const result = yield ticketingController.fetchTicketById(params.id);
            return {
                status: 200,
                body: result,
            };
        }
        catch (err) {
            return {
                status: 500,
                body: {
                    error: "Failed to update ticket.",
                },
            };
        }
    }),
    getTicketsForUserByStatus: (_c) => __awaiter(void 0, [_c], void 0, function* ({ params, query }) {
        try {
            const userId = params.id;
            const page = parseInt(query.page, 10);
            const pageSize = parseInt(query.pageSize, 10);
            const tickets = yield ticketingController.getTicketsForUserByStatusHandler(userId, query.status, page, pageSize);
            return {
                status: 200,
                body: tickets,
            };
        }
        catch (error) {
            return {
                status: 500,
                body: {
                    error: "Something went wrong while fetching tickets.",
                },
            };
        }
    }),
    createTickets: (_d) => __awaiter(void 0, [_d], void 0, function* ({ body }) {
        try {
            yield ticketingController.createTicket(body);
            return {
                status: 200,
                body: {
                    message: "Ticket created successfully",
                },
            };
        }
        catch (error) {
            return {
                status: 500,
                body: {
                    error: "Failed to create ticket.",
                },
            };
        }
    }),
    editTickets: (_e) => __awaiter(void 0, [_e], void 0, function* ({ params, body }) {
        try {
            yield ticketingController.updateTicket(params.id, body);
            return {
                status: 200,
                body: {
                    message: "Ticket updated successfully",
                },
            };
        }
        catch (error) {
            return {
                status: 500,
                body: {
                    error: "Failed to update ticket.",
                },
            };
        }
    }),
    receiveTickets: (_f) => __awaiter(void 0, [_f], void 0, function* ({ params, body }) {
        try {
            const response = yield ticketingController.receiveTicketHandler(params.id, body.dateReceived);
            return {
                status: 201,
                body: {
                    message: response.message,
                },
            };
        }
        catch (error) {
            return {
                status: 500,
                body: {
                    error: "Failed to receive ticket.",
                },
            };
        }
    }),
    forwardTickets: (_g) => __awaiter(void 0, [_g], void 0, function* ({ params, body }) {
        try {
            yield ticketingController.updateTicket(params.id, body);
            return {
                status: 200,
                body: {
                    message: "Ticket updated successfully",
                },
            };
        }
        catch (error) {
            return {
                status: 500,
                body: {
                    error: "Failed to update ticket.",
                },
            };
        }
    }),
    resolveTickets: (_h) => __awaiter(void 0, [_h], void 0, function* ({ params, body }) {
        try {
            yield ticketingController.resolveTicketHandler(params.id, body.userId);
            return {
                status: 200,
                body: {
                    message: "Ticket resolved",
                },
            };
        }
        catch (error) {
            return {
                status: 500,
                body: {
                    error: "Failed to update ticket.",
                },
            };
        }
    }),
    reopenTickets: (_j) => __awaiter(void 0, [_j], void 0, function* ({ params, body }) {
        try {
            yield ticketingController.reopenTicketHandler(params.id, body.requestee);
            return {
                status: 200,
                body: {
                    message: "Ticket reopened",
                },
            };
        }
        catch (error) {
            return {
                status: 500,
                body: {
                    error: "Failed to update ticket.",
                },
            };
        }
    })
});
const registerTicketingRoutes = (app) => {
    (0, express_1.createExpressEndpoints)(shared_contract_1.contracts.ticketing, ticketingRouter, app);
};
exports.registerTicketingRoutes = registerTicketingRoutes;
