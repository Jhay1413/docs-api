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
const transactionRouter = __1.s.router(shared_contract_1.transactionContract, {
    fetchTransactions: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield transactionService.getTransactionsService();
            return {
                status: 200,
                body: result,
            };
        }
        catch (error) {
            return {
                status: 500,
                body: {
                    error: "something went wrong ",
                },
            };
        }
    }),
    insertTransacitons: (_a) => __awaiter(void 0, [_a], void 0, function* ({ body }) {
        try {
            const result = yield transactionController.insertTransactionHandler(body);
            return {
                status: 200,
                body: result
            };
        }
        catch (error) {
            return {
                status: 501,
                body: {
                    error: error
                }
            };
        }
    })
});
const registerTransactionRoutes = (app) => {
    (0, express_1.createExpressEndpoints)(shared_contract_1.transactionContract, transactionRouter, app);
};
exports.registerTransactionRoutes = registerTransactionRoutes;
