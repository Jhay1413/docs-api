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
exports.NotificationController = void 0;
const notification_service_1 = require("./notification.service");
class NotificationController {
    constructor() {
        this.notificationService = new notification_service_1.NotificationService();
    }
    readNotificationController(id, isRead) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.notificationService.readNotificationService(id, isRead);
                return;
            }
            catch (error) {
                throw new Error("Something went wrong change status of notification!");
            }
        });
    }
    getNotificationsByUserController(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = this.notificationService.getNotificationsByUserIdService(id);
                return response;
            }
            catch (error) {
                throw new Error("Something went wrong change status of notification!");
            }
        });
    }
}
exports.NotificationController = NotificationController;
