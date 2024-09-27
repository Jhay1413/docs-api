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
exports.registerTransactionRoutes = void 0;
const express_1 = require("@ts-rest/express");
const shared_contract_1 = require("shared-contract");
const transaction_service_v2_1 = require("./transaction.service-v2");
const __1 = require("../..");
const transaction_controller_v2_1 = require("./transaction.controller-v2");
const transactionService = new transaction_service_v2_1.TransactionService();
const transactionController = new transaction_controller_v2_1.TransactionController();
const transactionRouter = __1.s.router(shared_contract_1.contracts.transaction, {
    searchTransactions: (_a) => __awaiter(void 0, [_a], void 0, function* ({ params }) {
        try {
            console.log(params.query, "adasdsads");
            if (params.query) {
                const result = yield transactionController.getSearchedTransation(params.query);
                return {
                    status: 201,
                    body: result || null,
                };
            }
            else {
                const result = yield transactionController.fetchAllTransactions();
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
    insertTransacitons: (_b) => __awaiter(void 0, [_b], void 0, function* ({ body }) {
        try {
            console.log(body);
            const result = yield transactionController.insertTransactionHandler(body);
            console.log(result);
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
    fetchTransactionById: (_c) => __awaiter(void 0, [_c], void 0, function* ({ params }) {
        try {
            const result = yield transactionController.fetchTransactionByIdHandler(params.id);
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
    updateTransaction: (_d) => __awaiter(void 0, [_d], void 0, function* ({ body }) {
        try {
            const result = yield transactionController.forwardTransactionHandler(body);
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
});
const registerTransactionRoutes = (app) => {
    (0, express_1.createExpressEndpoints)(shared_contract_1.contracts.transaction, transactionRouter, app);
};
exports.registerTransactionRoutes = registerTransactionRoutes;
