import { response } from "express";
import { db } from "../../prisma";
import { transactionFormData, transactionLogsData } from "./transaction.schema";
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
    fileData,
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
            data: fileData,
          },
        },
      },
      include: {
        attachments: true,
        forwarder: true,
        recieve: true,
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
      },
    });

    return transaction;
  } catch (error) {
    console.log(error);
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
        transactionId: id,
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
        transactionLogs: true,
      },
    });
    return response;
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
    console.log(response);

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
        recieve: true,
        company: true,
        project: true,
      },
    });

    const result = {
      ...response,
      dueDate: new Date(response.dueDate).toISOString(),
      dateForwarded: new Date(response.dateForwarded).toISOString(),
      dateReceived: new Date(response.dateReceived!).toISOString(),
    };

    return result;
  } catch (error) {
    throw new Error("Error while receiving transaction .");
  }
};

export const getReceivedTransactions = async (
  userId:string
) => {
  try {
    const response = await db.transaction.findMany({
      where:{
          receivedById:userId
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
    })
    return response
  } catch (error) {

  }
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
    };

    if (data.attachments) {
      createData.attachments = {
        connect: data.attachments.map((attachment) => ({
          id: attachment.id,
        })),
      };
    }
    await db.transactionLogs.create({
      data: createData,
    });
    return true;
  } catch (error) {
    console.log(error);
    throw new Error("something went wrong while adding logs. ");
  }
};
