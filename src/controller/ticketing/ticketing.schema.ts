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
	remarks: z.string(),
	priority: z.string(),
	dueDate: z.string().datetime(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
	attachments: z.string().url(),
	transactionId: z.string(),
  	projectId: z.string(),
  	senderId: z.string(),
  	receiverId: z.string(),
  	assigneeId: z.string(),
  	requesteeId: z.string(),
  });

export const ticketingLogsData = z.object({
	id: z.string().optional(),
	ticketId: z.string(),
	subject: z.string(),
	section: z.string(),
	status: z.string(),
	remarks: z.string(),
	priority: z.string(),
	dueDate: z.string().datetime(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
	attachments: z.string().url(),
	transactionId: z.string(),
  	projectId: z.string(),
  	senderId: z.string(),
  	receiverId: z.string(),
  	assigneeId: z.string(),
  	requesteeId: z.string(),
});