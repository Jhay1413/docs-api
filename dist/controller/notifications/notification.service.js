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
exports.NotificationService = void 0;
const prisma_1 = require("../../prisma");
class NotificationService {
    readNotificationService(id, dateRead) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(id);
            try {
                yield prisma_1.db.notification.update({
                    where: {
                        id: id,
                    },
                    data: {
                        isRead: true,
                        dateRead: dateRead,
                    },
                });
            }
            catch (error) {
                console.log(error);
                throw new Error("Something went wrong updating notification ! ");
            }
        });
    }
    getNotificationsByUserIdService(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield prisma_1.db.notification.findMany({
                    where: {
                        receiverId: id,
                    },
                });
                const converted_data = result.map((data) => {
                    var _a;
                    return Object.assign(Object.assign({}, data), { dateRead: ((_a = data.dateRead) === null || _a === void 0 ? void 0 : _a.toISOString()) || null, createdAt: data.createdAt.toISOString() });
                });
                return converted_data;
            }
            catch (error) {
                console.log(error);
                throw new Error("Something went wrong fetching notification ! ");
            }
        });
    }
    getNumberOfUnreadNotif(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield prisma_1.db.notification.count({
                    where: {
                        receiverId: id,
                        isRead: false,
                    },
                });
                return result;
            }
            catch (error) {
                console.log(error);
                throw new Error("Something went wrong fetching notification ! ");
            }
        });
    }
}
exports.NotificationService = NotificationService;
