"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentInfoSchema = exports.transactionData = exports.filesSchema = void 0;
const zod_1 = require("zod");
exports.filesSchema = zod_1.z.object({
    fileName: zod_1.z.string(),
    fileUrl: zod_1.z.string(),
    fileOriginalName: zod_1.z.string(),
});
exports.transactionData = zod_1.z.object({
    transactionId: zod_1.z.string(),
    documentType: zod_1.z.string(),
    subject: zod_1.z.string(),
    company: zod_1.z.string(),
    forwardedTo: zod_1.z.string(),
    remarks: zod_1.z.string(),
    createdBy: zod_1.z.string(),
    fromDepartment: zod_1.z.string(),
    toDepartment: zod_1.z.string(),
    dueDate: zod_1.z.string().transform((value) => new Date(value)),
    forwardedBy: zod_1.z.string(),
    dateForwarded: zod_1.z.string().transform((value) => new Date(value)),
    team: zod_1.z.string(),
    documentSubType: zod_1.z.string(),
    fileData: zod_1.z.array(exports.filesSchema)
});
exports.documentInfoSchema = zod_1.z.object({
    id: zod_1.z.string(),
    documentType: zod_1.z.string(),
    subject: zod_1.z.string(),
    dueDate: zod_1.z.date(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
    createdBy: zod_1.z.string(),
    documentSubType: zod_1.z.string(),
    team: zod_1.z.string(),
    createdByName: zod_1.z.string(),
    fromDepartment: zod_1.z.string(),
    toDepartment: zod_1.z.string(),
});
