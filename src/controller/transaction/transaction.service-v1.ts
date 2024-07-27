import { db } from "../../prisma";
import {
  completeStaffWork,
  transactionFormData,
  transactionLogsData,
} from "./transaction.schema";
import * as z from "zod";
export const insertTransactionService = async (
  data: z.infer<typeof transactionFormData>
) => {
  const {
    transactionId,
    documentType,
    subject,
    forwardedTo,
    remarks,
    dueDate,
    forwardedById,
    forwardedByRole,
    originDepartment,
    targetDepartment,
    dateForwarded,
    documentSubType,
    team,
    projectId,
    companyId,
    status,
    priority,
    attachments,
  } = data;

  try {
    const createdTransaction = await db.transaction.create({
      data: {
        transactionId,
        documentType,
        subject,
        dueDate,
        team,
        status,
        priority,
        projectId,
        companyId,
        documentSubType,
        forwardedTo,
        remarks,
        dateForwarded,
        forwardedById,
        targetDepartment,
        forwardedByRole,
        originDepartment,
        attachments: {
          createMany: {
            data: attachments,
          },
        },
      },
      include: {
        attachments: true,
        forwarder: true,
        receive: true,
        company: true,
        project: true,
      },
    });
    const result = {
      ...createdTransaction,
      dueDate: new Date(createdTransaction.dueDate).toISOString(),
      dateForwarded: new Date(createdTransaction.dateForwarded).toISOString(),
    };
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Error creating transaction");
  }
};

export const getTransactionService = async () => {
  try {
    const transaction = await db.transaction.findMany({
      select: {
        id: true,
        transactionId: true,
        subject: true,
        dueDate: true,
        documentSubType: true,
        documentType: true,
        team: true,
        status: true,
        priority: true,
        remarks: true,
        dateForwarded: true,
        forwardedByRole: true,
        originDepartment: true,
        targetDepartment: true,
        forwardedTo: true,
        attachments: true,
      },
    });

    return transaction;
  } catch (error) {
    throw new Error("Error fetching documents");
  }
};

export const getLastId = async () => {
  try {
    const response = await db.transaction.findFirst({
      orderBy: {
        createdAt: "desc",
      },
      take: 1,
      select: {
        transactionId: true,
      },
    });
    if (!response) {
      return null;
    }
    return response?.transactionId;
  } catch (error) {
    throw new Error("Error fetching last ID");
  }
};
export const getTransactionById = async (id: string) => {
  try {
    const response = await db.transaction.findUnique({
      where: {
        id: id,
      },
      include: {
        company: {
          include: {
            contactPersons: true,
          },
        },
        project: {
          include: {
            contactPersons: true,
          },
        },
        receive: true,
        transactionLogs: true,
        attachments: true,
        completeStaffWork: true,
      },
    });

    const parseResponse = response?.transactionLogs.map((respo) => {
      return { ...respo, attachments: JSON.parse(respo.attachments) };
    });

    return { ...response, transactionLogs: parseResponse };
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching transaction");
  }
};

export const getUserInfo = async (id: string) => {
  try {
    const response = await db.userAccounts.findFirst({
      where: {
        id,
      },
      include: {
        userInfo: true,
      },
    });
    return response;
  } catch (error) {
    throw new Error("Error fetching user info on service .");
  }
};

export const getIncomingTransactionByManager = async (
  role: string,
  department: string
) => {
  try {
    const response = await db.transaction.findMany({
      where: {
        forwardedTo: role,
        targetDepartment: department,
        dateReceived: null,
      },

      select: {
        id: true,
        transactionId: true,
        subject: true,
        dueDate: true,
        documentSubType: true,
        documentType: true,
        team: true,
        status: true,
        priority: true,
        remarks: true,
        dateForwarded: true,
        forwardedByRole: true,
        originDepartment: true,
        targetDepartment: true,
        forwardedTo: true,
      },
    });

    return response;
  } catch (error) {
    throw new Error("Error while fetching incoming transaction");
  }
};
export const receiveTransactionById = async (
  id: string,
  receivedBy: string,
  dateReceived: Date
) => {
  try {
    const response = await db.transaction.update({
      where: {
        transactionId: id,
      },
      data: {
        receivedById: receivedBy,
        dateReceived: dateReceived,
      },
      include: {
        attachments: true,
        forwarder: true,
        receive: true,
        company: true,
        project: true,
      },
    });
    return response;
  } catch (error) {
    throw new Error("Error while receiving transaction .");
  }
};

export const getReceivedTransactions = async (userId: string) => {
  try {
    const response = await db.transaction.findMany({
      where: {
        receivedById: userId,
      },

      select: {
        id: true,
        transactionId: true,
        subject: true,
        dueDate: true,
        documentSubType: true,
        documentType: true,
        team: true,
        status: true,
        priority: true,
        remarks: true,
        dateForwarded: true,
        forwardedByRole: true,
        originDepartment: true,
        targetDepartment: true,
        forwardedTo: true,
      },
    });
    return response;
  } catch (error) {}
};

//For post transaction e. logging/auditing

export const logPostTransactions = async (
  data: z.infer<typeof transactionLogsData>
) => {
  try {
    const createData: any = {
      ...data,
      transactionId: data.transactionId,
      dueDate: data.dueDate!,
      dateForwarded: data.dateForwarded!,
      attachments: JSON.stringify(data.attachments),
    };

    await db.transactionLogs.create({
      data: createData,
    });
    return true;
  } catch (error) {
    console.log(error);
    throw new Error("something went wrong while adding logs. ");
  }
};
// export const logPostTransactionsV2 = async (method:string,transactionId:string,accountId:string,new_data:string,old_data?:string)=>{
//   try {
//     const response = await db.transactionLog.create({
//       data:{
//         old_data : method === "POST" ? null : old_data,
//         current_data : new_data,
//         transactionId:transactionId,
//         createdById:accountId,
//         operation:method
//       }
//     })
//     console.log(response)
//     return response;
//   } catch (error) {
//     await revertTransaction(old_data || new_data,method)
//     throw new Error("something went wrong ! ")
//   }
// }

export const revertTransaction = async (data: string, method: string) => {
  try {
    if (method === "POST") {
      const payload = JSON.parse(data);
      const response = await db.transaction.delete({
        where: {
          id: payload.id,
        },
      });
      return response;
    } else if (method == "UPDATE") {
      const payload = JSON.parse(data) as z.infer<typeof transactionFormData>;

      await db.transaction.update({
        where: {
          id: payload.id,
        },
        data: {
          ...payload,
          attachments: {
            update: payload.attachments.map((attachment) => ({
              where: {
                id: attachment.id,
              },
              data: attachment,
            })),
          },
        },
      });
      return;
    }
  } catch (error) {
    throw new Error("Something went wrong performing cleanup ! ");
  }
};
//refactor starts here

export const forwardTransaction = async (
  data: z.infer<typeof transactionFormData>
) => {
  const {
    documentType,
    subject,
    forwardedTo,
    remarks,
    dueDate,
    forwardedById,
    forwardedByRole,
    originDepartment,
    targetDepartment,
    dateForwarded,
    documentSubType,
    team,
    transactionId,
    id,
    status,
    priority,
    attachments,
  } = data;
  try {
    const createAttachment = attachments.filter((attachment) => !attachment.id);
    const updateAttachment = attachments.filter((attachment) => attachment.id);
    const response = await db.transaction.update({
      where: {
        transactionId: transactionId,
      },
      data: {
        documentType: documentType,
        documentSubType: documentSubType,
        subject: subject,
        dueDate: dueDate,
        team: team,
        status: status,
        priority: priority,
        forwardedTo: forwardedTo,
        remarks: remarks,
        receivedById: null,
        forwardedById: forwardedById,
        dateForwarded: dateForwarded,
        dateReceived: null,
        originDepartment: originDepartment,
        targetDepartment: targetDepartment,
        forwardedByRole: forwardedByRole,
        attachments: {
          createMany: {
            data: createAttachment,
          },
          update: updateAttachment.map((attachment) => ({
            where: {
              id: attachment.id!,
            },
            data: attachment,
          })),
        },
      },
      include: {
        attachments: true,
        forwarder: true,
        receive: true,
        company: true,
        project: true,
      },
    });
    const result = {
      ...response,
      dueDate: new Date(response.dueDate).toISOString(),
      dateForwarded: new Date(response.dateForwarded).toISOString(),
      dateReceived: response.dateReceived
        ? new Date(response.dateReceived!).toISOString()
        : null,
    };
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("something went wrong while updating transaction ");
  }
};
export const fetchTransactions = async (
  accountId?: string,
  department?: string,
  role?: string,
  option?: string,
  section?: string,
  transactionId?: string
) => {
  let filters: any = {};
  const adminRole = ["MANAGER", "RECORDS"];

  const commonRole = ["TL", "CH"];

  try {
    if (adminRole.includes(role!)) {
      filters = {
        forwardedTo: role,
        ...(role === "MANAGER" && { targetDepartment: department }),
        ...(option === "INCOMING"
          ? { dateReceived: null }
          : { receivedById: accountId }),
      };
    } else if (commonRole.includes(role!)) {
      filters = {
        team: section,
        forwardedTo: role,
        ...(option === "INCOMING"
          ? { dateReceived: null }
          : { receivedById: accountId }),
      };
    } else {
      filters = {
        id: transactionId,
      };
    }
    const response = await db.transaction.findMany({
      where: filters,
      select: {
        id: true,
        transactionId: true,
        subject: true,
        dueDate: true,
        documentSubType: true,
        documentType: true,
        team: true,
        status: true,
        priority: true,
        remarks: true,
        dateForwarded: true,
        forwardedByRole: true,
        originDepartment: true,
        targetDepartment: true,
        forwardedTo: true,
      },
    });
    console.log(response, "asdsad");
    return response;
  } catch (error) {
    console.log(error);
    throw new Error("something went wrong while fetching transaction. ");
  }
};

export const receivedLatestLogs = async (
  transactionId: string,
  dateReceived: Date,
  receivedByEmail: string
) => {
  try {
    console.log();
    const recentLogs = await db.transactionLogs.findFirst({
      where: {
        transactionId,
      },
      orderBy: { createdAt: "desc" },
    });
    console.log(recentLogs);
    if (!recentLogs) {
      throw new Error("No logs found !");
    }
    const updateLogs = await db.transactionLogs.update({
      where: {
        id: recentLogs.id,
      },
      data: {
        dateReceived,
        receivedBy: receivedByEmail,
      },
    });
    console.log(updateLogs);
    return;
  } catch (error) {
    throw new Error("Something went wrong ");
  }
};

//CSW SERVICES

export const updateTransactionCswById = async (
  transactionId: string,
  data: z.infer<typeof completeStaffWork>[]
) => {
  const cswToUpdate = data.filter((csw) => csw.id);
  const cswToCreate = data.filter((csw) => !csw.id);

  try {
    const response = await db.transaction.update({
      where: {
        id: transactionId,
      },
      data: {
        completeStaffWork: {
          update: cswToUpdate.map((csw) => ({
            where: {
              id: csw.id!,
            },
            data: {
              date: csw.date,
              remarks: csw.remarks,
              attachmentUrl: csw.attachmentUrl,
            },
          })),
          createMany: {
            data: cswToCreate,
          },
        },
      },
      include: {
        attachments: true,
        forwarder: true,
        receive: true,
        company: true,
        project: true,
        completeStaffWork: true,
      },
    });

    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong while adding csw ! ");
  }
};
export const fetchCSWByTransactionId = async (id: string) => {
  try {
    const response = await db.completeStaffWork.findMany({
      where: {
        transactionId: id,
      },
    });
    return response;
  } catch (error) {
    console.log(error);
    throw new Error("something went wrong while fetching csw. ");
  }
};
