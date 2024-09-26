import z from "zod";
import { transactionQueryData } from "shared-contract";
const cleanedDataUtils = (data: z.infer<typeof transactionQueryData>) => {
  const cleanedData = {
    ...data,
    company: data.company?.companyName!,
    project: data.project?.projectName!,
    forwarder: `${data.forwarder?.email} - ${data.forwarder?.accountRole}`,
    attachments: data.attachments!,
    receiver: `${data.receiver?.email} - ${data.receiver?.accountRole}` || null,
    transactionId: data.id!,
  };
  const { id,companyId,projectId, forwarderId,receiverId,...payload } = cleanedData;


  const createData: any = {
    ...payload,
    transactionId: payload.transactionId,
    dueDate: payload.dueDate!,
    dateForwarded: payload.dateForwarded!,
    attachments: payload.attachments,
  };


  return createData;
};



export { cleanedDataUtils };


