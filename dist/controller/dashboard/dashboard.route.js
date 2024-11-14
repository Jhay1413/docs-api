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
exports.dsahboardRoutes = void 0;
const shared_contract_1 = require("shared-contract");
const ts_rest_server_1 = __importDefault(require("../../utils/ts-rest-server"));
const dashboard_controller_1 = require("./dashboard.controller");
const express_1 = require("@ts-rest/express");
const dashboardController = new dashboard_controller_1.DashboardController();
const dashboardRouter = ts_rest_server_1.default.router(shared_contract_1.contracts.dashboardContract, {
    getDashboardData: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield dashboardController.getDashboardData();
            return {
                status: 200,
                body: result,
            };
        }
        catch (error) {
            return {
                status: 500,
                body: {
                    error: "Something went wrong ",
                },
            };
        }
    }),
});
const dsahboardRoutes = (app) => {
    (0, express_1.createExpressEndpoints)(shared_contract_1.contracts.dashboardContract, dashboardRouter, app);
};
exports.dsahboardRoutes = dsahboardRoutes;
