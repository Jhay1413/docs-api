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
exports.registerTransactionRoutes = void 0;
const express_1 = require("@ts-rest/express");
const shared_contract_1 = require("shared-contract");
const transaction_controller_v2_1 = require("./transaction.controller-v2");
const ts_rest_server_1 = __importDefault(require("../../utils/ts-rest-server"));
const transactionController = new transaction_controller_v2_1.TransactionController();
const transactionRouter = ts_rest_server_1.default.router(shared_contract_1.contracts.transaction, {
    archivedTransation: (_a) => __awaiter(void 0, [_a], void 0, function* ({ params, body }) {
        try {
            yield transactionController.archivedTransactionHandler(params.id, body.userId);
            return {
                status: 200,
                body: {
                    message: "Data has been archived successully ! ",
                },
            };
        }
        catch (error) {
            console.log(error);
            return {
                status: 500,
                body: {
                    error: "Something went wrong ",
                },
            };
        }
    }),
    addCompleteStaffWork: (_b) => __awaiter(void 0, [_b], void 0, function* ({ params, body }) {
        try {
            const result = yield transactionController.updateCswById(params.id, body);
            const new_csw = result.completeStaffWork.map((data) => {
                return Object.assign(Object.assign({}, data), { date: data.date.toISOString(), transactionId: data.transactionId, createdAt: data.createdAt.toISOString(), updatedAt: data.updatedAt.toISOString() });
            });
            const data = Object.assign(Object.assign({}, result), { dueDate: new Date(result.dueDate).toISOString(), dateForwarded: new Date(result.dateForwarded).toISOString(), transactionId: result.transactionId, dateReceived: result.dateReceived ? new Date(result.dateReceived).toISOString() : null, completeStaffWork: new_csw });
            return {
                status: 201,
                body: data,
            };
        }
        catch (error) {
            return {
                status: 500,
                body: {
                    error: "something went wrongssss",
                },
            };
        }
    }),
    getTransactionByParams: (_c) => __awaiter(void 0, [_c], void 0, function* ({ query }) {
        try {
            const result = yield transactionController.fetchTransactionsByParamsHandler(query.status, query.accountId);
            return {
                status: 200,
                body: result,
            };
        }
        catch (error) {
            return {
                status: 500,
                body: {
                    error: "something went wrongssss",
                },
            };
        }
    }),
    receivedTransaction: (_d) => __awaiter(void 0, [_d], void 0, function* ({ params, body }) {
        console.log(params.id);
        try {
            const result = yield transactionController.receivedTransactionHandler(params.id, body.dateReceived);
            return {
                status: 200,
                body: result,
            };
        }
        catch (error) {
            return {
                status: 500,
                body: {
                    error: "something went wrongssss",
                },
            };
        }
    }),
    searchTransactions: (_e) => __awaiter(void 0, [_e], void 0, function* ({ query }) {
        try {
            console.log(query.pageSize);
            const page = parseInt(query.page, 10);
            const pageSize = parseInt(query.pageSize, 10);
            if (query.query) {
                const result = yield transactionController.getSearchedTransation(query.query, page, pageSize, query.status);
                return {
                    status: 201,
                    body: result || null,
                };
            }
            else {
                const result = yield transactionController.fetchAllTransactions(query.status, page, pageSize);
                return {
                    status: 201,
                    body: result || null,
                };
            }
        }
        catch (error) {
            return {
                status: 500,
                body: {
                    error: "something went wrongssss",
                },
            };
        }
    }),
    fetchTransactionById: (_f) => __awaiter(void 0, [_f], void 0, function* ({ params }) {
        try {
            const result = yield transactionController.fetchTransactionByIdHandler(params.id);
            // const new_csw = result.completeStaffWork.sort((a, b) => {
            //   const dateA = new Date(a.date);
            //   const dateB = new Date(b.date);
            //   return dateA.getTime() - dateB.getTime();
            // });
            return {
                status: 200,
                body: result,
            };
        }
        catch (error) {
            return {
                status: 500,
                body: {
                    error: "something went wrong",
                },
            };
        }
    }),
    // fetchTransactions: async () => {
    //   try {
    //     const result = await transactionController.fetchAllTransactions();
    //     return {
    //       status: 200,
    //       body: result,
    //     };
    //   } catch (error) {
    //     return {
    //       status: 500,
    //       body: {
    //         error: "something went wrong ",
    //       },
    //     };
    //   }
    // },
    insertTransacitons: (_g) => __awaiter(void 0, [_g], void 0, function* ({ body }) {
        try {
            console.log(body);
            const result = yield transactionController.insertTransactionHandler(body);
            return {
                status: 200,
                body: result,
            };
        }
        catch (error) {
            return {
                status: 501,
                body: {
                    error: error,
                },
            };
        }
    }),
    updateTransaction: (_h) => __awaiter(void 0, [_h], void 0, function* ({ body }) {
        try {
            yield transactionController.forwardTransactionHandler(body);
            return {
                status: 200,
                body: {
                    success: "data updated Successfully",
                },
            };
        }
        catch (error) {
            return {
                status: 500,
                body: {
                    error: "something went wrong",
                },
            };
        }
    }),
});
const registerTransactionRoutes = (app) => {
    (0, express_1.createExpressEndpoints)(shared_contract_1.contracts.transaction, transactionRouter, app);
};
exports.registerTransactionRoutes = registerTransactionRoutes;
