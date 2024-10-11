import { Prisma } from "@prisma/client";
import { db } from "../../prisma";
import { completeStaffWork, notification } from "./transaction.schema";
import * as z from "zod";
import { filesQuerySchema, transactionLogsData, transactionMutationSchema } from "shared-contract";
import { completeStaffWorkMutationSchema, filesMutationSchema } from "shared-contract/dist/schema/transactions/mutation-schema";

export class TransactionService {
  public async insertTransaction(data: z.infer<typeof transactionMutationSchema>, tx: Prisma.TransactionClient) {
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
          ...data,
          transactionId: data.transactionId!,
          receiverId: status == "ARCHIVED" ? null : receiverId,
          dateReceived: null,
          attachments: {
            createMany: {
              data: attachments,
            },
          },
        },
        include: {
          attachments: true,
          company: true,
          project: true,
        },
      });

      const modified_transaction = {
        ...createdTransaction,
        dueDate: createdTransaction.dueDate.toISOString(),
        dateForwarded: createdTransaction.dateForwarded.toISOString(),
        attachments: createdTransaction.attachments.map((data) => {
          return { ...data, createdAt: data.createdAt.toISOString() };
        }),
        dateReceived: null,
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
              dateForwarded: "asc",
            },
          },
          attachments: true,
          completeStaffWork: {
            omit: {
              updatedAt: true,
              createdAt: true,
            },
          },
        },
      });
      if (!transaction) throw new Error("transaction not found");
      const new_attachments = transaction.attachments.map((data) => {
        return {
          ...data,
          createdAt: data.createdAt.toISOString(),
        };
      });
      const new_csw = transaction.completeStaffWork.map((data) => {
        return { ...data, date: data.date.toISOString(), transactionId: data.transactionId! };
      });
      const parseTransactionLogs = transaction?.transactionLogs.map((respo) => {
        const parseAttachments = JSON.parse(respo.attachments) as z.infer<typeof filesQuerySchema>[];
        const newAttachmentsLogs = parseAttachments.map((data) => {
          return { ...data, createdAt: new Date(data.createdAt!).toISOString() };
        });
        return {
          ...respo,
          attachments: newAttachmentsLogs,
          createdAt: respo.createdAt.toISOString(),
          updatedAt: respo.updatedAt.toISOString(),
          dateForwarded: respo.dateForwarded.toISOString(),
          dueDate: respo.dueDate.toISOString(),
          dateReceived: respo.dateReceived ? respo.dateReceived.toISOString() : null,
        };
      });

      //  const {transactionLogs, ...transationData} = transaction
      const parseData = {
        ...transaction,
        dueDate: transaction.dueDate.toISOString(),
        dateForwarded: transaction.dateForwarded.toISOString(),
        dateReceived: transaction.dateReceived ? transaction.dateReceived.toISOString() : null,
        transactionLogs: parseTransactionLogs,
        completeStaffWork: new_csw,
        attachments: new_attachments,
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

      const returned_data = response.map((data) => {
        return {
          ...data,
          dueDate: data.dueDate.toISOString(),
          dateForwarded: data.dateForwarded.toISOString(),
          dateReceived: data.dateReceived ? data.dateReceived.toISOString() : null,
        };
      });
      return returned_data;
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
      const returned_data = response.map((data) => {
        return {
          ...data,
          dueDate: data.dueDate.toISOString(),
          dateForwarded: data.dateForwarded.toISOString(),
          dateReceived: data.dateReceived ? data.dateReceived.toISOString() : null,
        };
      });
      return returned_data;
    } catch (error) {
      console.error("Error fetching transaction", error);
      throw new Error("Failed to fetch received transaction");
    }
  }

  // public async getTransactionsService(status: string, page: number, pageSize: number) {
  //   const skip = (page - 1) * pageSize;
  //   console.log(page, pageSize);
  //   try {
  //     const transactions = await db.transaction.findMany({
  //       skip,
  //       take: pageSize,

  //       where: {
  //         status: {
  //           equals: status,
  //         },
  //       },
  //       include: {
  //         forwarder: {
  //           include: {
  //             userInfo: true,
  //           },
  //         },
  //         receiver: {
  //           include: {
  //             userInfo: true,
  //           },
  //         },
  //         project: true,
  //         company: true,
  //         attachments: {
  //           omit: {
  //             createdAt: true,
  //           },
  //         },
  //       },
  //       orderBy: {
  //         createdAt: "desc",
  //       },
  //     });

  //     // Post-process to calculate percentage and combine names
  //     if (!transactions) return null;
  //     const processedTransactions = transactions.map((t) => {
  //       const finalAttachmentCount = t.attachments.filter((a) => a.fileStatus === "FINAL_ATTACHMENT").length;
  //       const totalAttachmentCount = t.attachments.length;

  //       const percentage = totalAttachmentCount ? (finalAttachmentCount * 100) / totalAttachmentCount : 0;

  //       return {
  //         ...t,
  //         dueDate: t.dueDate.toISOString(),
  //         dateForwarded: t.dateForwarded.toISOString(),
  //         dateReceived: t.dateReceived ? t.dateReceived.toISOString() : null,
  //         forwarderName: `${t.forwarder?.userInfo?.firstName} ${t.forwarder?.userInfo?.lastName}`,
  //         receiverName: `${t.receiver?.userInfo?.firstName} ${t.receiver?.userInfo?.lastName}`, // Assuming you include receiver info in a similar way
  //         percentage: Math.round(percentage).toString(),
  //       };
  //     });
  //     return processedTransactions;
  //   } catch (error) {
  //     console.error("Error fetching transaction", error);
  //     throw new Error("Failed to fetch transactions");
  //   }
  // }
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
      const response = await db.$transaction(async (tx) => {
        const incoming = await tx.transaction.count({
          where: {
            receiverId: accountId,
            dateReceived: {
              equals: null,
            },
            status: {
              not: "ARCHIEVED",
            },
          },
        });
        const outgoing = await tx.transaction.count({
          where: {
            receiverId: accountId,
            dateReceived: {
              not: null,
            },
            status: {
              not: "ARCHIEVED",
            },
          },
        });

        return { incoming, outgoing };
      });
      return response;
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong !");
    }
  }
  public async archivedTransactionService(id: string, userId: string) {
    try {
      const result = await db.transaction.update({
        where: {
          id: id,
        },
        data: {
          forwarderId: userId,
          receiverId: null,
          dateReceived: null,
          status: "ARCHIVED",
        },
        include: {
          attachments: true,
          company: true,
          project: true,
          forwarder: {
            include: {
              userInfo: true,
            },
          },
          receiver: true,
        },
      });
      const modified_data = {
        ...result,
        dueDate: result.dueDate.toISOString(),
        dateForwarded: result.dateForwarded.toISOString(),
        dateReceived: null,
        attachments: result.attachments.map((data) => {
          return { ...data, createdAt: data.createdAt.toDateString() };
        }),
      };
      return modified_data;
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong !");
    }
  }
  public async forwardTransactionService(
    data: z.infer<typeof transactionMutationSchema>,
    createAttachment: z.infer<typeof filesMutationSchema>[],
    updateAttachment: z.infer<typeof filesMutationSchema>[],
    tx: Prisma.TransactionClient,
  ) {
    try {
      const response = await tx.transaction.update({
        where: {
          transactionId: data.transactionId,
        },
        data: {
          ...data,
          dateReceived: null,
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
          company: true,
          project: true,
        },
      });
      const modified_data = {
        ...response,
        dueDate: response.dueDate.toISOString(),
        dateForwarded: response.dateForwarded.toISOString(),
        dateReceived: null,
        attachments: response.attachments.map((data) => {
          return { ...data, createdAt: data.createdAt.toDateString() };
        }),
      };
      return modified_data;
    } catch (error) {
      console.log(error);
      throw new Error("something went wrong while updating transaction ");
    }
  }
  public async receiveTransactionService(id: string, dateReceived: string) {
    try {
      const response = await db.transaction.update({
        where: {
          id: id,
        },
        data: {
          dateReceived: dateReceived,
        },
        select: {
          id: true,
          transactionId: true,
          project: {
            select: {
              projectName: true,
            },
          },
          company: {
            select: {
              companyName: true,
            },
          },
          percentage: true,
          documentType: true,
          documentSubType: true,
          subject: true,
          dueDate: true,
          forwarder: {
            select: {
              userInfo: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          dateForwarded: true,
          dateReceived: true,
          receiverId: true,
          receiver: {
            select: {
              userInfo: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          status: true,
          priority: true,
        },
      });

      const receiver = response.receiver?.userInfo ? `${response.receiver.userInfo.firstName} - ${response.receiver.userInfo.lastName}` : null;
      const forwarder = response.forwarder?.userInfo ? `${response.forwarder.userInfo.firstName} - ${response.forwarder.userInfo.lastName}` : null;
      return { ...response, receiver: receiver, forwarder: forwarder, dueDate: response.dueDate.toISOString() };
    } catch (error) {
      console.log(error);
      throw new Error("Error while receiving transaction .");
    }
  }
  public async receivedLogsService(transactionId: string, dateForwarded: Date, dateReceived: Date, userId: string) {
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
  public async logPostTransaction(data: z.infer<typeof transactionLogsData>, tx: Prisma.TransactionClient) {
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
  public async updateTransactionCswById(transactionId: string, data: z.infer<typeof completeStaffWorkMutationSchema>) {
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
                attachmentUrl: data.attachmentUrl!,
              },
              create: {
                date: data.date,
                remarks: data.remarks,
                attachmentUrl: data.attachmentUrl!,
              },
            },
          },
        },
        include: {
          attachments: {
            omit: {
              createdAt: true,
            },
          },
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

  //Unused function
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
  public async addNotificationService(data: z.infer<typeof notification>, tx?: Prisma.TransactionClient) {
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
      console.log(error);
      throw new Error("Error inserting notification");
    }
  }
  public async fetchAllNotificationById(id: string, tx?: Prisma.TransactionClient) {
    try {
      let response;
      if (tx) {
        response = await tx.notification.findMany({
          where: {
            receiverId: id,
          },
          include: {
            forwarder: true,
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
          include: {
            forwarder: {
              include: {
                userInfo: true,
              },
            },
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

  public async countTransactions(query: string, status?: string, userId?: string) {
    var condition: any = {};

    if (status === "INBOX") {
      condition = {
        receiverId: userId,
        dateReceived: {
          not: null,
        },
      };
    } else if (status === "INCOMING") {
      condition = {
        receiverId: userId,
        dateReceived: {
          equals: null,
        },
      };
    } else {
      condition = {
        status: {
          equals: status,
        },
      };
    }
    try {
      const transactions = await db.transaction.count({
        where: {
          AND: [
            condition,
            {
              OR: [
                {
                  company: {
                    OR: [{ companyName: { contains: query, mode: "insensitive" } }, { companyId: { contains: query, mode: "insensitive" } }],
                  },
                },
                {
                  project: {
                    OR: [{ projectName: { contains: query, mode: "insensitive" } }, { projectId: { contains: query, mode: "insensitive" } }],
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
      });
      return transactions;
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong while counting");
    }
  }

  public async getTransactionsWithStatus(status?: string) {
    try {
      const transactionWith = await db.transaction.findMany({
        where: {
          status: {
            equals: status || "ON-PROCESS",
            mode: "insensitive",
          },
        },
      });
      return transactionWith;
    } catch (error) {
      console.log(error);
      throw new Error("Error fetching transactions");
    }
  }

  public async getTransactionsService(query: string, page: number, pageSize: number, status?: string, userId?: string) {
    const skip = (page - 1) * pageSize;

    var condition: any = {};

    if (status === "INBOX") {
      console.log("iminbox");
      condition = {
        receiverId: userId,
        dateReceived: {
          not: null,
        },
      };
    } else if (status === "INCOMING") {
      condition = {
        receiverId: userId,
        dateReceived: {
          equals: null,
        },
      };
    } else {
      condition = {
        status: {
          equals: status,
        },
      };
    }
    try {
      const transactions = await db.transaction.findMany({
        skip,
        take: pageSize,
        where: {
          AND: [
            condition,
            {
              OR: [
                {
                  company: {
                    OR: [{ companyName: { contains: query, mode: "insensitive" } }, { companyId: { contains: query, mode: "insensitive" } }],
                  },
                },
                {
                  project: {
                    OR: [{ projectName: { contains: query, mode: "insensitive" } }, { projectId: { contains: query, mode: "insensitive" } }],
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
          company: true,
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
        return {
          ...t,
          dueDate: t.dueDate.toISOString(),
          dateForwarded: t.dateForwarded.toISOString(),

          dateReceived: t.dateReceived ? t.dateReceived.toISOString() : null,
          forwarderName: `${t.forwarder?.userInfo?.firstName} ${t.forwarder?.userInfo?.lastName}`,
          receiverName: `${t.receiver?.userInfo?.firstName} ${t.receiver?.userInfo?.lastName}`, // Assuming you include receiver info in a similar way
        };
      });

      return processedTransactions;
    } catch (error) {
      console.log(error);
      throw new Error("something went wrong while searching");
    }
  }

  public async getTransactionServiceV2(query: string, page: number, pageSize: number, status?: string, userId?: string) {
    const skip = (page - 1) * pageSize;
    var condition: any = {};

    if (status === "INBOX") {
      condition = {
        receiverId: userId,
        dateReceived: {
          not: null,
        },
      };
    } else if (status === "INCOMING") {
      condition = {
        receiverId: userId,
        dateReceived: {
          equals: null,
        },
      };
    } else {
      condition = {
        status: {
          equals: status,
        },
      };
    }
    try {
      const transactions = await db.transaction.findMany({
        skip,
        take: pageSize,
        where: {
          AND: [
            condition,
            {
              OR: [
                {
                  company: {
                    OR: [{ companyName: { contains: query, mode: "insensitive" } }, { companyId: { contains: query, mode: "insensitive" } }],
                  },
                },
                {
                  project: {
                    OR: [{ projectName: { contains: query, mode: "insensitive" } }, { projectId: { contains: query, mode: "insensitive" } }],
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
        select: {
          id: true,
          transactionId: true,
          project: {
            select: {
              projectName: true,
            },
          },
          company: {
            select: {
              companyName: true,
            },
          },
          percentage: true,
          documentType: true,
          documentSubType: true,
          subject: true,
          dueDate: true,
          forwarder: {
            select: {
              userInfo: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          receiver: {
            select: {
              userInfo: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          status: true,
          priority: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      const newData = transactions.map((data) => {
        const receiver = data.receiver?.userInfo ? `${data.receiver.userInfo.firstName} - ${data.receiver.userInfo.lastName}` : null;
        const forwarder = data.forwarder?.userInfo ? `${data.forwarder.userInfo.firstName} - ${data.forwarder.userInfo.lastName}` : null;
        return {
          ...data,
          dueDate: data.dueDate.toISOString(),
          receiver: receiver,
          forwarder: forwarder,
        };
      });

      return newData;
    } catch (error) {
      console.log("Something went wrong while fetching transactions.", error);
      throw new Error("something went wrong while searching");
    }
  }
}
