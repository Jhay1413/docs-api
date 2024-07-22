import { z, ZodObject } from "zod";
import { AccountSchema, accountSchema } from "../user/user.schema";
import { companyFormData, projects } from "../company/company.schema";
const FileTypeEnum = z.enum(["INITIAL_DOC", "FOLLOWED_UP"]);
export const filesSchema = z.object({
  id: z.string().optional(),
  remarks: z.string().optional(),
  createdAt: z.date().optional(),
  fileType: FileTypeEnum.optional(),
  fileName: z.string(),
  fileStatus: z.nullable(z.string()).optional(),
  fileUrl: z.nullable(z.string()).optional(),
  fileOriginalName: z.nullable(z.string()).optional(),
});

export const transactionFormData = z.object({
  id: z.string().optional(),
  transactionId: z.string(),
  documentType: z.string(),
  documentSubType: z.string(),
  subject: z.string(),
  dueDate: z.string().datetime(),
  team: z.string(),
  status: z.string(),
  priority: z.string(),
  companyId: z.string(),
  projectId: z.string(),
  forwardedTo: z.string(),
  remarks: z.string(),
  receivedById: z.nullable(z.string()).optional(),
  forwardedById: z.string(),
  dateForwarded: z.string().datetime(),
  dateReceived: z.nullable(z.string().datetime()).optional(),
  originDepartment: z.string(),
  targetDepartment: z.string(),
  forwardedByRole: z.string(),
  attachments: z.array(filesSchema),
});

export const transactionData = transactionFormData
  .extend({
    forwarder: AccountSchema.optional(),
    receive: z.nullable(AccountSchema).optional(),

    company: companyFormData.optional(),
    project: projects.optional(),
  })
  .omit({
    companyId: true,
    projectId: true,
    forwardedById: true,
  });
export const transactionLogsData = z.object({
  id: z.string().optional(),
  transactionId: z.string(),
  documentType: z.string(),
  subject: z.string(),
  dueDate: z.string().datetime(),
  documentSubType: z.string(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  team: z.string(),
  status: z.string(),
  priority: z.string(),
  company: z.string(),
  project: z.string(),
  forwardedTo: z.string(),
  remarks: z.string(),
  receivedBy: z.nullable(z.string()).optional(),
  forwardedBy: z.string(),
  dateForwarded: z.string().datetime(),
  dateReceived: z.nullable(z.string().datetime()).optional(),
  originDepartment: z.string(),
  targetDepartment: z.string(),
  forwardedByRole: z.string(),
  attachments: z.array(filesSchema),
});

export const paramsRequestData = z.array(
  z.object({
    company: z.string(),
    fileName: z.string(),
    signedUrl: z.string().optional(),
    uploadStatus: z.boolean().optional(),
    signedStatus: z.boolean().optional(),
    key: z.nullable(z.string()).optional(),
    fileOriginalName: z.nullable(z.string()).optional(),
    index: z.number().optional(),
  })
);

//CSW SCHEMA

export const transactionLog = z.object({
  id: z.number(),
  old_data: z.nullable(z.string()).optional(),
  new_data: z.nullable(z.string()).optional(),
  method: z.string(),
  createdById: z.string(),
  transactionId: z.string(),
});
export const completeStaffWork = z.object({
  id: z.string().optional(),
  date: z.string().datetime(),
  remarks: z.string(),
  attachmentUrl: z.string(),
  transactionId: z.nullable(z.string()).optional(),
});
export type TFilesData = z.infer<typeof filesSchema>;
