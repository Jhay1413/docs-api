import { z, ZodObject } from "zod";
import { AccountSchema, accountSchema } from "../user/user.schema";
import { companyFormData, projects } from "../company/company.schema";
import { filesSchema } from "../transaction/transaction.schema";

export const ticketingFormData = z.object({
    id: z.string().optional(),
	ticketId: z.string(),
	subject: z.string(),
	section: z.string(),
	status: z.string(),
	requestDetails: z.string(),
	priority: z.string(),
	dueDate: z.string().datetime(),
	senderId: z.string(),
	receiverId: z.string(),
	remarks: z.string().optional(),
  	projectId: z.string().optional(),
	transactionId: z.string().optional(),
	attachments: z.string().optional(),
});

export const ticketingLogsData = z.object({
	id: z.string().optional(),
	ticketId: z.string(),
	subject: z.string(),
	section: z.string(),
	status: z.string(),
	priority: z.string(),
	dueDate: z.string().datetime(),
	senderId: z.string(),
	receiverId: z.string(),
	remarks: z.string(),
  	projectId: z.string().optional(),
	transactionId: z.string().optional(),
	attachments: z.string().optional(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
});
