import { z } from "zod";

export const ticketingFormData = z.object({
    id: z.string().optional(),
    ticketId: z.string(),
    subject: z.string(),
    section: z.string(),
	division: z.string(),
    status: z.string(),
	requestType: z.string(),
    requestDetails: z.string(),
    priority: z.string(),
    dueDate: z.string().datetime(),
    senderId: z.string(),
    receiverId: z.string(),
	requesteeId: z.string(),
    remarks: z.string().nullable(),
    projectId: z.string().nullable(),
    transactionId: z.string().nullable(),
    attachments: z.string().nullable(),
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
