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
exports.getDocumentsService = exports.insertTransactionService = void 0;
const prisma_1 = require("../../prisma");
const insertTransactionService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { documentType, subject, forwardedTo, remarks, createdBy, dueDate, forwardedBy, toDepartment, fromDepartment, dateForwarded, documentSubType, team, fileData, } = data;
    try {
        yield prisma_1.db.documentInfo.create({
            data: {
                documentType,
                subject,
                dueDate,
                createdBy,
                team,
                documentSubType,
                documentHistory: {
                    create: {
                        forwardedTo,
                        remarks,
                        subject,
                        dateForwarded,
                        forwardedBy,
                        toDepartment,
                        fromDepartment,
                        attachments: {
                            createMany: {
                                data: fileData,
                            },
                        },
                    },
                },
            },
        });
        return true;
    }
    catch (error) {
        throw new Error("Error creating transaction");
    }
});
exports.insertTransactionService = insertTransactionService;
const getDocumentsService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const documents = yield prisma_1.db.documentInfo.findMany({
            relationLoadStrategy: 'join',
            include: {
                documentHistory: {
                    select: {
                        fromDepartment: true,
                        toDepartment: true,
                    },
                    take: 1,
                    orderBy: {
                        createdAt: 'asc'
                    }
                },
                account: {
                    select: {
                        userInfo: {
                            select: {
                                firstName: true,
                                lastName: true
                            }
                        }
                    }
                }
            }
        });
        const data = [];
        documents.map((doc) => {
            var _a, _b, _c, _d, _e, _f;
            data.push({
                id: doc.id,
                documentType: doc.documentType,
                subject: doc.subject,
                dueDate: doc.dueDate,
                createdBy: doc.createdBy,
                team: doc.team,
                fromDepartment: (_a = doc === null || doc === void 0 ? void 0 : doc.documentHistory[0]) === null || _a === void 0 ? void 0 : _a.fromDepartment,
                toDepartment: (_b = doc === null || doc === void 0 ? void 0 : doc.documentHistory[0]) === null || _b === void 0 ? void 0 : _b.toDepartment,
                createdAt: doc.createdAt,
                updatedAt: doc.updatedAt,
                documentSubType: doc.documentSubType,
                createdByName: ((_d = (_c = doc === null || doc === void 0 ? void 0 : doc.account) === null || _c === void 0 ? void 0 : _c.userInfo) === null || _d === void 0 ? void 0 : _d.firstName) + " " + ((_f = (_e = doc === null || doc === void 0 ? void 0 : doc.account) === null || _e === void 0 ? void 0 : _e.userInfo) === null || _f === void 0 ? void 0 : _f.lastName),
            });
        });
        return data;
    }
    catch (error) {
        console.log(error);
        throw new Error("Error fetching documents");
    }
});
exports.getDocumentsService = getDocumentsService;
