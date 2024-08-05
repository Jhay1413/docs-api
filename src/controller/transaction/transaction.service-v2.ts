import { PrismaClient } from "@prisma/client";
import { db } from "../../prisma";
import {
  completeStaffWork,
  transactionData,
  transactionFormData,
  transactionLogsData,
} from "./transaction.schema";
import * as z from "zod";

export class TransactionService {
  public async insertTransaction(data: z.infer<typeof transactionFormData>) {
    const {
      transactionId,
      documentType,
      subject,
      receiverId,
      remarks,
      dueDate,
      forwarderId,
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
          receiverId,
          remarks,
          dateForwarded,
          forwarderId,
          targetDepartment,
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
          receiver: true,
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
  }
  public async getTransactionByIdService(id: string) {
    try {
      const transaction = await db.transaction.findUnique({
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
          receiver: true,
          forwarder: true,
          transactionLogs: true,
          attachments: true,
          completeStaffWork: true,
        },
      });

      const parseResponse = transaction?.transactionLogs.map((respo) => {
        return { ...respo, attachments: JSON.parse(respo.attachments) };
      });

      return { ...transaction, transactionLogs: parseResponse };
    } catch (error) {
      console.error("Error fetching transaction", error);
      throw new Error("Failed to fetch transaction");
    }
  }

  public async getIncomingTransactionService(id: string) {
    try {
      const response = await db.transaction.findMany({
        where: {
          receiverId: id,
          dateReceived: {
            equals: null,
            
          },
          status:{
            not : "ARCHIEVED"
        },
        },
      });
      return response;
    } catch (error) {
      console.error("Error fetching transaction", error);
      throw new Error("Failed to fetch Incoming transaction");
    }
  }
  public async getReceivedTransactionService(id: string) {
    try {
      const response = await db.transaction.findMany({
        where: {
          receiverId: id,
          dateReceived: {
            not: null,
          },
        },
      });
      return response;
    } catch (error) {
      console.error("Error fetching transaction", error);
      throw new Error("Failed to fetch received transaction");
    }
  }

  public async getTransactionsService() {
    try {
      const transactions = await db.$queryRaw`
        SELECT 
            t.id,
            t."transactionId",
            t."documentType",
            t.subject,
            t."dueDate",
            t."createdAt",
            t."updatedAt",
            t."documentSubType",
            t."originDepartment",
            t."targetDepartment",
            t."dateForwarded",
            b."accountRole",
            t.status,
            t.priority,
            COALESCE(
                ROUND((SUM(CASE WHEN a."fileStatus" = 'FINAL_ATTACHMENT' THEN 1 ELSE 0 END) * 100.0) / NULLIF(COUNT(a.id), 0)),
                0
            ) AS percentage
        FROM "Transaction" t
        LEFT JOIN "Attachment" a ON t.id = a."transactionId"
        LEFT JOIN "UserAccounts" b ON b.id = t."forwarderId"
        GROUP BY
          t.id,
          t."transactionId",
          t."documentType",
          t.subject,
          t."dueDate",
          t."createdAt",
          t."updatedAt",
          t."documentSubType",
          t."originDepartment",
          t."targetDepartment",
          t."dateForwarded",
          b."accountRole",
          t.status,
          t.priority;
        `;

      return transactions;
    } catch (error) {
      console.error("Error fetching transaction", error);
      throw new Error("Failed to fetch transactions");
    }
  }
  public async getArchievedTransaction(){
    try {
      const response = await db.transaction.findMany({
        where:{
          status :"ARCHIEVED"

        },
        select:{
          id:true,
          transactionId:true,
          company:true,
          project:true,
          documentSubType:true,
          createdAt:true,
          remarks:true
        }
      })
      return response
    } catch (error) {
      console.log(error)
      throw new Error("Failed to fetch archieved transactions ! ")
    }
  }
  public async getIncomingTransaction(accountId?: string) {
    try {
      const [incomingCount, outgoingCount] = await Promise.all([
        db.transaction.count({
          where: {
            receiverId: accountId,
            dateReceived: {
              equals: null,
            },
            status:{
                not : "ARCHIEVED"
            },
          },
        }),
        db.transaction.count({
          where: {
            receiverId: accountId,
            dateReceived: {
              not: null,
            },
            status:{
              not : "ARCHIEVED"
          },
          },
        }),
      ]);

      return {
        incomingCount,
        outgoingCount,
      };
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong !");
    }
  }

  public async forwardTransactionService(
    data: z.infer<typeof transactionFormData>
  ) {
    const {
      documentType,
      subject,
      receiverId,
      remarks,
      dueDate,
      forwarderId,
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
      const createAttachment = attachments.filter(
        (attachment) => !attachment.id
      );
      const updateAttachment = attachments.filter(
        (attachment) => attachment.id
      );
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
          forwarderId,
          remarks: remarks,
          receiverId,
          dateForwarded: dateForwarded,
          dateReceived: null,
          originDepartment: originDepartment,
          targetDepartment: targetDepartment,
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
          receiver: true,
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
      } as z.infer<typeof transactionData>;
      return result;
    } catch (error) {
      console.log(error);
      throw new Error("something went wrong while updating transaction ");
    }
  }
  public async receiveTransactionService(id: string, dateReceived: string) {
    try {
      const response = await db.transaction.update({
        where: {
          transactionId: id,
        },
        data: {
          dateReceived: dateReceived,
        },
        include: {
          attachments: true,
          forwarder: true,
          receiver: true,
          company: true,
          project: true,
        },
      });
      return response;
    } catch (error) {
      throw new Error("Error while receiving transaction .");
    }
  }
  public async receivedLogsService(
    transactionId: string,
    dateForwarded: Date,
    dateReceived: Date,
    userId: string
  ) {
    try {
      const response = await db.transactionLogs.update({
        where: {
          refId: {
            transactionId: transactionId,
            receiverId: userId,
            dateForwarded: dateForwarded,
          },
        },
        data: {
          dateReceived: dateReceived,
        },
      });
      return response;
    } catch (error) {
      console.log(error);
      throw new Error("Error while receiving transaction .");
    }
  }
  public async logPostTransaction(data: z.infer<typeof transactionLogsData>) {
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
  }
  public async updateTransactionCswById(
    transactionId: string,
    data: z.infer<typeof completeStaffWork>
  ) {
    try {
      const response = await db.transaction.update({
        where: {
          id: transactionId,
        },
        data: {
          completeStaffWork: {
            upsert: {
              where: {
                id: data.id || "",
              },
              update: {
                date: data.date,
                remarks: data.remarks,
                attachmentUrl: data.attachmentUrl,
              },
              create: {
                date: data.date,
                remarks: data.remarks,
                attachmentUrl: data.attachmentUrl,
              },
            },
          },
        },
        include: {
          attachments: true,
          forwarder: true,
          receiver: true,
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
  }
  public async getDepartmentEntities() {
    try {
      console.log("Adsadsad12312321");
      const transactions = await db.$queryRaw`
      SELECT 
        t.id,
        t."accountRole" as Role,
        t."email",
        a."assignedDivision" as Division,
        a."assignedSection" as Section,
        a."assignedPosition" as Position,
        CONCAT(a."firstName", ' - ', a."lastName",'-',t."accountRole") AS Fullname
      FROM "UserAccounts" t 
      LEFT JOIN "UserInfo" a ON t.id = a."accountId"
              `;

      return transactions;
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong while fetching entities! ");
    }
  }
  public async getLastId() {
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
  }
  public async getUserInfo(id: string) {
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
  }
}
