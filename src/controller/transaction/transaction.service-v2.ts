import { Prisma } from "@prisma/client";
import { db } from "../../prisma";
import {
  completeStaffWork,
  notification
} from "./transaction.schema";
import * as z from "zod";
import {
  transactionLogsData,
  transactionMutationSchema
} from "shared-contract";

export class TransactionService {
  public async insertTransaction(
    data: z.infer<typeof transactionMutationSchema>,
    tx: Prisma.TransactionClient
  ) {
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
      const createdTransaction = await tx.transaction.create({
        data: {
          transactionId: data.transactionId!,
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

      const new_attachments = createdTransaction.attachments.map(
        (attachment) => {
          return {
            ...attachment,
            createdAt: attachment.createdAt.toISOString(),
          };
        }
      );
      const modified_transaction = {
        ...createdTransaction,
        dueDate: createdTransaction.dueDate.toISOString(),
        dateForwarded: createdTransaction.dateForwarded.toISOString(),
        dateReceived: createdTransaction.dateReceived
          ? createdTransaction.dateReceived.toISOString()
          : null,
        attachments: new_attachments,
      };
      return modified_transaction;
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
          transactionLogs: {
            orderBy: {
              createdAt: "asc",
            },
          },
          attachments: true,
          completeStaffWork: {
            omit:{
              updatedAt:true,
              createdAt:true,
            }
          },
        },
      });

      if (!transaction) throw new Error("transaction not found");
      
      const new_attachments = transaction.attachments.map((data) => {
        return { ...data, createdAt: data.createdAt.toISOString() };
      });
      const new_csw = transaction.completeStaffWork.map((data)=>{
        return {...data,date:data.date.toISOString()}
      })
      const parseTransactionLogs = transaction?.transactionLogs.map((respo) => {
        return {
          ...respo,
          attachments: JSON.parse(respo.attachments),
          createdAt: respo.createdAt.toISOString(),
          updatedAt: respo.updatedAt.toISOString(),
          dateForwarded: respo.dateForwarded.toISOString(),
          dueDate: respo.dueDate.toISOString(),
          dateReceived : respo.dateReceived ? respo.dateReceived.toISOString() : null,
        
        };
      });

      //  const {transactionLogs, ...transationData} = transaction
      const parseData = {
        ...transaction,
        dueDate: transaction.dueDate.toISOString(),
        dateForwarded: transaction.dateForwarded.toISOString(),
        dateReceived: transaction.dateReceived
          ? transaction.dateReceived.toISOString()
          : null,
        transactionLogs: parseTransactionLogs,
        attachments: new_attachments,
        completeStaffWork : new_csw
      };

      // const validateData = transactionQueryData.safeParse(parseResponse);
      // if(validateData.error){
      //   console.log(validateData.error.errors)
      //   throw new Error("data not validated")
      // }

      return parseData;
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
          status: {
            not: "ARCHIEVED",
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          forwarder: {
            include: {
              userInfo: true,
            },
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
        orderBy: {
          createdAt: "desc",
        },
        include: {
          forwarder: {
            include: {
              userInfo: true,
            },
          },
        },
      });
      return response;
    } catch (error) {
      console.error("Error fetching transaction", error);
      throw new Error("Failed to fetch received transaction");
    }
  }

  public async getTransactionsService(
    status: string,
    page: number,
    pageSize: number
  ) {
    const skip = (page - 1) * pageSize;
    console.log(page,pageSize)
    try {
      const transactions = await db.transaction.findMany({
        skip,
        take: pageSize,

        where: {
          status: {
            equals: status,
          },
        },
        include: {
          forwarder: {
            include: {
              userInfo: true,
            },
          },
          receiver: {
            include: {
              userInfo: true,
            },
          },
          project: true,
          company:true,
          attachments: {
            omit: {
              createdAt: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // Post-process to calculate percentage and combine names
      if (!transactions) return null;
      const processedTransactions = transactions.map((t) => {
        const finalAttachmentCount = t.attachments.filter(
          (a) => a.fileStatus === "FINAL_ATTACHMENT"
        ).length;
        const totalAttachmentCount = t.attachments.length;

        const percentage = totalAttachmentCount
          ? (finalAttachmentCount * 100) / totalAttachmentCount
          : 0;

        return {
          ...t,
          dueDate: t.dueDate.toISOString(),
          dateForwarded: t.dateForwarded.toISOString(),
          dateReceived: t.dateReceived ? t.dateReceived.toISOString() : null,
          forwarderName: `${t.forwarder?.userInfo?.firstName} ${t.forwarder?.userInfo?.lastName}`,
          receiverName: `${t.receiver?.userInfo?.firstName} ${t.receiver?.userInfo?.lastName}`, // Assuming you include receiver info in a similar way
          percentage: Math.round(percentage).toString(),
        };
      });
      return processedTransactions;
    } catch (error) {
      console.error("Error fetching transaction", error);
      throw new Error("Failed to fetch transactions");
    }
  }
  public async getArchivedTransaction() {
    try {
      const response = await db.transaction.findMany({
        where: {
          status: "ARCHIVED",
        },
        select: {
          id: true,
          transactionId: true,
          company: true,
          project: true,
          documentSubType: true,
          createdAt: true,
          remarks: true,
        },
      });
      return response;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to fetch archieved transactions ! ");
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
            status: {
              not: "ARCHIEVED",
            },
          },
        }),
        db.transaction.count({
          where: {
            receiverId: accountId,
            dateReceived: {
              not: null,
            },
            status: {
              not: "ARCHIEVED",
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
    data: z.infer<typeof transactionMutationSchema>,
    tx: Prisma.TransactionClient
  ) {
    const {
      documentType,
      subject,
      receiverId,
      remarks,
      companyId,
      projectId,
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
      const response = await tx.transaction.update({
        where: {
          transactionId: transactionId,
        },
        data: {
          documentType: documentType,
          documentSubType: documentSubType,
          subject: subject,
          dueDate: dueDate,
          team: team,
          companyId: companyId,
          projectId: projectId,
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
      const new_attachments = response.attachments.map((attachment) => {
        return {
          ...attachment,
          createdAt: attachment.createdAt.toISOString(),
        };
      });
      const modified_transaction = {
        ...response,
        dueDate: response.dueDate.toISOString(),
        dateForwarded: response.dateForwarded.toISOString(),
        dateReceived: response.dateReceived
          ? response.dateReceived.toISOString()
          : null,
        attachments: new_attachments,
      };
      return modified_transaction;
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
  public async logPostTransaction(
    data: z.infer<typeof transactionLogsData>,
    tx: Prisma.TransactionClient
  ) {
    try {
      const createData: any = {
        ...data,
        transactionId: data.transactionId,
        dueDate: data.dueDate!,
        dateForwarded: data.dateForwarded!,
        attachments: JSON.stringify(data.attachments),
      };

      await tx.transactionLogs.create({
        data: createData,
      });
      return;
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
  public async addNotificationService(
    data: z.infer<typeof notification>,
    tx?: Prisma.TransactionClient
  ) {
    try {
      let response;
      if (tx) {
        response = await tx.notification.create({
          data,
          include: {},
        });
      } else {
        response = await db.notification.create({
          data,
          include: {},
        });
      }

      return response;
    } catch (error) {
      throw new Error("Error inserting notification");
    }
  }
  public async fetchAllNotificationById(
    id: string,
    tx?: Prisma.TransactionClient
  ) {
    try {
      let response;
      if (tx) {
        response = await tx.notification.findMany({
          where: {
            receiverId: id,
          },
          orderBy: {
            createdAt: "desc", // or 'desc'
          },
        });
      } else {
        response = await db.notification.findMany({
          where: {
            receiverId: id,
          },
          orderBy: {
            createdAt: "desc", // or 'desc'
          },
        });
      }
      return response;
    } catch (error) {
      console.log(error);
      throw new Error("Error fetching notification !");
    }
  }
  public async readAllNotificationService(id: string) {
    try {
      await db.notification.updateMany({
        where: {
          receiverId: id,
        },
        data: {
          isRead: true,
        },
      });
      return;
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong on read notification");
    }
  }
  public async getDashboardPriority() {
    try {
      const transactions = await db.$queryRaw`
      SELECT 
          t.id,
          t."transactionId",
          c."projectName",
          COALESCE(
              ROUND(
                  (SUM(CASE WHEN a."fileStatus" = 'FINAL_ATTACHMENT' THEN 1 ELSE 0 END) * 100.0) / NULLIF(COUNT(a.id), 0)
              ),
              0
          ) AS percentage
      FROM "Transaction" t
      LEFT JOIN "Attachment" a ON t.id = a."transactionId"
      LEFT JOIN "UserAccounts" b ON b.id = t."forwarderId"
      LEFT JOIN "CompanyProject" c ON c.id = t."projectId"
      WHERE t.status <> 'ARCHIVED' AND t.priority = 'HIGH'
      GROUP BY
          t.id,
          t."transactionId",
          c."projectName"
      ORDER BY 
          t."createdAt" DESC
      LIMIT 10;
  `;

      return transactions;
    } catch (error) {
      console.error("Error fetching transaction", error);
      throw new Error("Failed to fetch transactions");
    }
  }
  public async getTotalNumberOfProjects() {
    try {
      const transactions = await db.transaction.count({
        where: {
          status: {
            not: "ARCHIVED",
          },
        },
      });
      return transactions;
    } catch (error) {
      console.error("Error fetching transaction", error);
      throw new Error("Failed to fetch transactions");
    }
  }
  public async getNumberPerApplication() {
    try {
      const transactions = await db.transaction.groupBy({
        by: ["documentSubType"],
        _count: {
          id: true,
        },
        where: {
          status: {
            not: "ARCHIVED",
          },
        },
      });
      const countEachType = transactions.map((item) => ({
        categoryName: item.documentSubType,
        count: item._count.id,
      }));
      return countEachType;
    } catch (error) {
      console.error("Error fetching transaction", error);
      throw new Error("Failed to fetch transactions");
    }
  }
  public async getNumberPerSection() {
    try {
      const transactions = await db.transaction.groupBy({
        by: ["team"],
        _count: {
          id: true,
        },
        where: {
          status: {
            not: "ARCHIVED",
          },
        },
      });
      const data = transactions.map((item) => ({
        categoryName: item.team,
        count: item._count.id,
      }));
      return data;
    } catch (error) {
      console.error("Error fetching transaction", error);
      throw new Error("Failed to fetch transactions");
    }
  }
  public async searchTransaction(
    query: string,
    page: number,
    pageSize: number,
    status?: string
  ) {
    const skip = (page - 1) * pageSize;
    try {
      const transactions = await db.transaction.findMany({
        skip,
        take: pageSize,
        where: {
          status: {
            equals: status,
          },
          AND: [
            {
              OR: [
                {
                  company: {
                    OR: [
                      { companyName: { contains: query, mode: "insensitive" } },
                      { companyId: { contains: query, mode: "insensitive" } },
                    ],
                  },
                },
                {
                  project: {
                    OR: [
                      { projectName: { contains: query, mode: "insensitive" } },
                      { projectId: { contains: query, mode: "insensitive" } },
                    ],
                  },
                },
                { team: { contains: query, mode: "insensitive" } },
                { transactionId: { contains: query, mode: "insensitive" } },
                { documentSubType: { contains: query, mode: "insensitive" } },
                { targetDepartment: { contains: query, mode: "insensitive" } },
                { status: { contains: query, mode: "insensitive" } },
              ],
            },
          ],
        },
        include: {
          forwarder: {
            include: {
              userInfo: true,
            },
          },
          receiver: {
            include: {
              userInfo: true,
            },
          },
          project: true,
          company:true,
          attachments: {
            omit: {
              createdAt: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // Post-process to calculate percentage and combine names
      if (!transactions) return null;
      const processedTransactions = transactions.map((t) => {
        const finalAttachmentCount = t.attachments.filter(
          (a) => a.fileStatus === "FINAL_ATTACHMENT"
        ).length;
        const totalAttachmentCount = t.attachments.length;

        const percentage = totalAttachmentCount
          ? (finalAttachmentCount * 100) / totalAttachmentCount
          : 0;

        return {
          ...t,
          dueDate: t.dueDate.toISOString(),
          dateForwarded: t.dateForwarded.toISOString(),
          dateReceived: t.dateReceived ? t.dateReceived.toISOString() : null,
          forwarderName: `${t.forwarder?.userInfo?.firstName} ${t.forwarder?.userInfo?.lastName}`,
          receiverName: `${t.receiver?.userInfo?.firstName} ${
            t.receiver?.userInfo?.lastName
          }`, // Assuming you include receiver info in a similar way
          percentage: Math.round(percentage).toString(),
        };
      });

      return processedTransactions;
    } catch (error) {
      console.log(error);
      throw new Error("something went wrong while searching");
    }
  }
}
