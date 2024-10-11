import z from "zod";
import { filesMutationSchema, transactionQueryData, userInfoQuerySchema } from "shared-contract";
const cleanedDataUtils = (
  data: z.infer<typeof transactionQueryData>,
  forwaderData?: z.infer<typeof userInfoQuerySchema>,
  receiver?: z.infer<typeof userInfoQuerySchema> | null,
) => {
  const forwarder = forwaderData ? forwaderData : data.forwarder?.userInfo;
  const cleanedData = {
    ...data,
    company: data.company?.companyName!,
    project: data.project?.projectName!,
    forwarder: `${forwarder?.firstName} - ${forwarder?.lastName}`,
    attachments: data.attachments!,
    receiver: receiver ? `${receiver?.firstName} - ${receiver?.lastName}` : null,
    transactionId: data.id!,
  };
  const { id, companyId, projectId, forwarderId, ...payload } = cleanedData;

  const createData: any = {
    ...payload,
    transactionId: payload.transactionId,
    dueDate: payload.dueDate!,
    dateForwarded: payload.dateForwarded!,
    attachments: payload.attachments,
  };

  return createData;
};

const getAttachmentsPercentage = (attachments: z.infer<typeof filesMutationSchema>[]) => {
  if (!attachments) return 0;

  const attachmentsCount = attachments.length;
  const finalAttachmentsCount = attachments.filter(
    (attachment) => attachment.fileStatus === "FINAL_ATTACHMENT"
  ).length;

  return Math.ceil((finalAttachmentsCount * 100) / attachmentsCount);
};

export { cleanedDataUtils, getAttachmentsPercentage };
