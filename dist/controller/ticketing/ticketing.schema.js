"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketingFormData = void 0;
const zod_1 = require("zod");
exports.ticketingFormData = zod_1.z.object({
    id: zod_1.z.string().optional(),
    ticketId: zod_1.z.string(),
    subject: zod_1.z.string(),
    section: zod_1.z.string(),
    division: zod_1.z.string(),
    status: zod_1.z.string(),
    requestType: zod_1.z.string(),
    requestDetails: zod_1.z.string(),
    priority: zod_1.z.string(),
    dueDate: zod_1.z.string().datetime(),
    senderId: zod_1.z.string(),
    receiverId: zod_1.z.string(),
    requesteeId: zod_1.z.string(),
    remarks: zod_1.z.string().nullable(),
    projectId: zod_1.z.string().nullable(),
    transactionId: zod_1.z.string().nullable(),
    attachments: zod_1.z.string().nullable(),
});
// export const ticketingLogsData = z.object({
// 	id: z.string().optional(),
// 	ticketId: z.string(),
// 	subject: z.string(),
// 	section: z.string(),
// 	status: z.string(),
// 	priority: z.string(),
// 	dueDate: z.string().datetime(),
// 	senderId: z.string(),
// 	receiverId: z.string(),
// 	remarks: z.string(),
//   	projectId: z.string().optional(),
// 	transactionId: z.string().optional(),
// 	attachments: z.string().optional(),
// 	createdAt: z.string().datetime(),
// 	updatedAt: z.string().datetime(),
// });
