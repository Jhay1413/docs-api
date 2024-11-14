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
exports.registerNotificationRoutes = void 0;
const express_1 = require("@ts-rest/express");
const shared_contract_1 = require("shared-contract");
const ts_rest_server_1 = __importDefault(require("../../utils/ts-rest-server"));
const notification_controller_1 = require("./notification.controller");
const notificationController = new notification_controller_1.NotificationController();
const notificationRouter = ts_rest_server_1.default.router(shared_contract_1.contracts.notificationContract, {
    readNotif: (_a) => __awaiter(void 0, [_a], void 0, function* ({ params, body }) {
        try {
            yield notificationController.readNotificationController(params.id, body.dateRead);
            return {
                status: 200,
                body: {
                    message: "notification updated successfully ",
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
    getNotificationsByUserId: (_b) => __awaiter(void 0, [_b], void 0, function* ({ query }) {
        try {
            const result = yield notificationController.getNotificationsByUserController(query.id);
            return {
                status: 200,
                body: result,
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
});
const registerNotificationRoutes = (app) => {
    (0, express_1.createExpressEndpoints)(shared_contract_1.contracts.notificationContract, notificationRouter, app);
};
exports.registerNotificationRoutes = registerNotificationRoutes;
