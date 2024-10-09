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
exports.registerUserRoutes = void 0;
const shared_contract_1 = require("shared-contract");
const __1 = require("../..");
const express_1 = require("@ts-rest/express");
const user_controller_1 = require("./user.controller");
const userInfoRouter = __1.s.router(shared_contract_1.contracts.userAccounts, {
    getUserByRoleAccess: (_a) => __awaiter(void 0, [_a], void 0, function* ({ query }) {
        try {
            console.log(query);
            const result = yield (0, user_controller_1.fetchUserByRoleAccess)(query.id, query.targetDivision, query.team);
            return {
                status: 200,
                body: result,
            };
        }
        catch (error) {
            return {
                status: 500,
                body: {
                    error: "something went wrong ! ",
                },
            };
        }
    }),
    getUserInfoForSelect: (_b) => __awaiter(void 0, [_b], void 0, function* ({ query }) {
        console.log("fethching");
        try {
            const result = {};
            return {
                status: 201,
                body: result,
            };
        }
        catch (error) {
            return {
                status: 501,
                body: {
                    error: "something went wrong",
                },
            };
        }
    }),
});
const registerUserRoutes = (app) => {
    (0, express_1.createExpressEndpoints)(shared_contract_1.contracts.userAccounts, userInfoRouter, app);
};
exports.registerUserRoutes = registerUserRoutes;
