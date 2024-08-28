"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notification = exports.completeStaffWork = exports.transactionLog = exports.paramsRequestData = exports.transactionLogsData = exports.transactionData = exports.transactionFormData = exports.filesSchema = void 0;
const zod_1 = require("zod");
const user_schema_1 = require("../user/user.schema");
const company_schema_1 = require("../company/company.schema");
const FileTypeEnum = zod_1.z.enum(["INITIAL_DOC", "FOLLOWED_UP"]);
exports.filesSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    remarks: zod_1.z.string().optional(),
    createdAt: zod_1.z.date().optional(),
    fileType: FileTypeEnum.optional(),
    fileName: zod_1.z.string(),
    fileStatus: zod_1.z.nullable(zod_1.z.string()).optional(),
    fileUrl: zod_1.z.nullable(zod_1.z.string()).optional(),
    fileOriginalName: zod_1.z.nullable(zod_1.z.string()).optional(),
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
    receiverId: zod_1.z.nullable(zod_1.z.string()).optional(),
    remarks: zod_1.z.string(),
    receivedById: zod_1.z.nullable(zod_1.z.string()).optional(),
    forwarderId: zod_1.z.string(),
    dateForwarded: zod_1.z.string().datetime(),
    dateReceived: zod_1.z.nullable(zod_1.z.string().datetime()).optional(),
    originDepartment: zod_1.z.string(),
    targetDepartment: zod_1.z.string(),
    attachments: zod_1.z.array(exports.filesSchema),
});
exports.transactionData = exports.transactionFormData
    .extend({
    forwarder: user_schema_1.AccountSchema.optional(),
    receiver: zod_1.z.nullable(user_schema_1.AccountSchema).optional(),
    company: company_schema_1.companyFormData.optional(),
    project: company_schema_1.projects.optional(),
})
    .omit({
    companyId: true,
    projectId: true,
    forwarderId: true,
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
    forwarder: zod_1.z.string(),
    remarks: zod_1.z.string(),
    receiver: zod_1.z.nullable(zod_1.z.string()).optional(),
    dateForwarded: zod_1.z.string().datetime(),
    dateReceived: zod_1.z.nullable(zod_1.z.string().datetime()).optional(),
    originDepartment: zod_1.z.string(),
    targetDepartment: zod_1.z.string(),
    attachments: zod_1.z.array(exports.filesSchema),
});
exports.paramsRequestData = zod_1.z.array(zod_1.z.object({
    company: zod_1.z.string(),
    fileName: zod_1.z.string(),
    signedUrl: zod_1.z.string().optional(),
    uploadStatus: zod_1.z.boolean().optional(),
    signedStatus: zod_1.z.boolean().optional(),
    key: zod_1.z.nullable(zod_1.z.string()).optional(),
    fileOriginalName: zod_1.z.nullable(zod_1.z.string()).optional(),
    index: zod_1.z.number().optional(),
}));
//CSW SCHEMA
exports.transactionLog = zod_1.z.object({
    id: zod_1.z.number(),
    old_data: zod_1.z.nullable(zod_1.z.string()).optional(),
    new_data: zod_1.z.nullable(zod_1.z.string()).optional(),
    method: zod_1.z.string(),
    createdById: zod_1.z.string(),
    transactionId: zod_1.z.string(),
});
exports.completeStaffWork = zod_1.z.object({
    id: zod_1.z.string().optional(),
    date: zod_1.z.string().datetime(),
    remarks: zod_1.z.string(),
    attachmentUrl: zod_1.z.string(),
    transactionId: zod_1.z.nullable(zod_1.z.string()).optional(),
});
exports.notification = zod_1.z.object({
    id: zod_1.z.string().optional(),
    date: zod_1.z.string().datetime(),
    message: zod_1.z.string(),
    transactionId: zod_1.z.string(),
    forwarderId: zod_1.z.string(),
    receiverId: zod_1.z.string(),
    isRead: zod_1.z.boolean()
});
