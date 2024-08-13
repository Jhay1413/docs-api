import z from "zod";
import { transactionData } from "./transaction.schema";
const cleanedDataUtils = (data: z.infer<typeof transactionData>) => {
  const cleanedData = {
    ...data,
    company: data.company?.companyName!,
    project: data.project?.projectName!,
    forwarder: `${data.forwarder?.email} - ${data.forwarder?.accountRole}`,
    attachments: data.attachments!,
    receiver: `${data.receiver?.email} - ${data.receiver?.accountRole}` || null,
    transactionId: data.id!,
  };
  const { receivedById, id, ...payload } = cleanedData;

  return payload;
};



export { cleanedDataUtils };


