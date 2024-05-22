import { z } from "zod";

export const filesSchema = z.object({
  fileName: z.string(),
  fileUrl: z.string(),
  fileOriginalName: z.string(),
});


export const transactionData = z.object({
  transactionId: z.string(),
  documentType: z.string(),
  subject: z.string(),
  company: z.string(),
  forwardedTo: z.string(),
  remarks: z.string(),
  createdBy: z.string(),
  fromDepartment: z.string(),
  toDepartment: z.string(),
  dueDate: z.string().transform((value) => new Date(value)),
  forwardedBy: z.string(),
  dateForwarded:  z.string().transform((value) => new Date(value)),
  team: z.string(),
  documentSubType: z.string(),
  fileData : z.array(filesSchema)
})
export const documentInfoSchema = z.object({
  id: z.string(),
  documentType: z.string(),
  subject: z.string(),
  dueDate: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string(),
  documentSubType: z.string(),
  team: z.string(),
  createdByName: z.string(),
  fromDepartment: z.string(),
  toDepartment: z.string(),
});
export type TDcoumentInfo = z.infer<typeof documentInfoSchema>;
export type TtransactionData = z.infer<typeof transactionData>;

export type TFilesData = z.infer<typeof filesSchema>;

