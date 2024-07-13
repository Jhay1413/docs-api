"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionLogsData = exports.transactionData = exports.transactionFormData = exports.filesSchema = void 0;
const zod_1 = require("zod");
const user_schema_1 = require("../user/user.schema");
const company_schema_1 = require("../company/company.schema");
const FileTypeEnum = zod_1.z.enum(['INITIAL_DOC', 'FOLLOWED_UP']);
exports.filesSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    remarks: zod_1.z.string().optional(),
    createdAt: zod_1.z.string().datetime().optional(),
    fileType: FileTypeEnum.optional(),
    fileName: zod_1.z.string(),
    fileStatus: zod_1.z.nullable(zod_1.z.string()).optional(),
    fileUrl: zod_1.z.nullable(zod_1.z.string()).optional(),
    fileOriginalName: zod_1.z.string(),
});
exports.transactionFormData = zod_1.z.object({
    id: zod_1.z.string().optional(),
    transactionId: zod_1.z.string(),
    documentType: zod_1.z.string(),
    documentSubType: zod_1.z.string(),
    subject: zod_1.z.string(),
    dueDate: zod_1.z.string().datetime(),
    team: zod_1.z.string(),
    status: zod_1.z.string(),
    priority: zod_1.z.string(),
    companyId: zod_1.z.string(),
    projectId: zod_1.z.string(),
    forwardedTo: zod_1.z.string(),
    remarks: zod_1.z.string(),
    receivedById: zod_1.z.nullable(zod_1.z.string()).optional(),
    forwardedById: zod_1.z.string(),
    dateForwarded: zod_1.z.string().datetime(),
    dateReceived: zod_1.z.nullable(zod_1.z.string().datetime()).optional(),
    originDepartment: zod_1.z.string(),
    targetDepartment: zod_1.z.string(),
    forwardedByRole: zod_1.z.string(),
    fileData: zod_1.z.array(exports.filesSchema)
});
exports.transactionData = exports.transactionFormData.extend({
    forwarder: user_schema_1.AccountSchema.optional(),
    receive: zod_1.z.nullable(user_schema_1.AccountSchema).optional(),
    attachment: zod_1.z.nullable(zod_1.z.array(exports.filesSchema)).optional(),
    company: company_schema_1.companyFormData.optional(),
    project: company_schema_1.projects.optional(),
}).omit({
    companyId: true,
    projectId: true,
    forwardedById: true,
    fileData: true
});
exports.transactionLogsData = zod_1.z.object({
    id: zod_1.z.string().optional(),
    transactionId: zod_1.z.string(),
    documentType: zod_1.z.string(),
    subject: zod_1.z.string(),
    dueDate: zod_1.z.string().datetime(),
    documentSubType: zod_1.z.string(),
    createdAt: zod_1.z.string().datetime().optional(),
    updatedAt: zod_1.z.string().datetime().optional(),
    team: zod_1.z.string(),
    status: zod_1.z.string(),
    priority: zod_1.z.string(),
    company: zod_1.z.string(),
    project: zod_1.z.string(),
    forwardedTo: zod_1.z.string(),
    remarks: zod_1.z.string(),
    receivedBy: zod_1.z.nullable(zod_1.z.string()).optional(),
    forwardedBy: zod_1.z.string(),
    dateForwarded: zod_1.z.string().datetime(),
    dateReceived: zod_1.z.nullable(zod_1.z.string().datetime()).optional(),
    originDepartment: zod_1.z.string(),
    targetDepartment: zod_1.z.string(),
    forwardedByRole: zod_1.z.string(),
    attachments: zod_1.z.array(exports.filesSchema)
});
