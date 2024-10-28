import { StatusCodes } from "http-status-codes";
import { TransactionService } from "./transaction.service-v2";
import { Request, Response } from "express";
import { GenerateId } from "../../utils/generate-id";
import { cleanedDataUtils, getAttachmentsPercentage } from "./transaction.utils";
import { db } from "../../prisma";
import z from "zod";
import { io, userSockets } from "../..";
import { completeStaffWorkMutationSchema, filesQuerySchema, transactionMutationSchema, userInfoQuerySchema } from "shared-contract";
import { getUserInfoByAccountId } from "../user/user.service";
import { transferFile } from "../aws/aws.service";
export class TransactionController {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
  }
  public async insertTransactionHandler(data: z.infer<typeof transactionMutationSchema>) {
    const attachmentsPercentage = getAttachmentsPercentage(data.attachments);

    try {
      let receiverInfo: z.infer<typeof userInfoQuerySchema> | null = null;
      const lastId = await this.transactionService.getLastId();
      const generatedId = GenerateId(lastId);
      const data_payload = { ...data, transactionId: generatedId };
      if (data.status != "ARCHIVED" && data.receiverId) {
        receiverInfo = await getUserInfoByAccountId(data.receiverId);
      }
      if (data.status !== "ARCHIVED" && !data.receiverId) throw new Error("No receiver provided ! ");
      const forwarder = await getUserInfoByAccountId(data.forwarderId);

      const response = await db.$transaction(async (tx) => {
        const transaction = await this.transactionService.insertTransaction(data_payload, attachmentsPercentage, tx);
        const payload = cleanedDataUtils(transaction, forwarder!, receiverInfo);

        await this.transactionService.logPostTransaction(payload, tx);

        return transaction;
      });

      const fileToTransfer = data.attachments.filter((attachment) => attachment.fileUrl);
      if (fileToTransfer.length > 0) {
        await Promise.all(
          fileToTransfer.map(async (attachment) => {
            if (!attachment.fileUrl) {
              throw new Error("Attachment does not have a valid file URL");
            }
            try {
              const result = await transferFile(attachment.fileUrl);
              return result;
            } catch (error) {
              console.error(`Failed to transfer file ${attachment.fileUrl}:`, error);
              throw new Error(`Failed to transfer file: ${attachment.fileUrl}`);
            }
          }),
        );
      }

      if (response.status === "ARCHIVED") return response;

      const notifications = await this.transactionService.fetchAllNotificationById(response.receiverId!);
      const tracker = await this.transactionService.getIncomingTransaction(response.receiverId!);
      const message = "You have new notification";
      const receiverSocketId = userSockets.get(response.receiverId!);

      const quantityTracker = {
        incoming: tracker.incoming,
        inbox: tracker.outgoing,
      };

      const modified_message = notifications.map((data) => {
        return { ...data, message: `${forwarder?.firstName} ${forwarder?.lastName} ${data.message}` };
      });
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("notification", message, modified_message, quantityTracker);
      }
      return response;
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong ! ");
    } finally {
      await db.$disconnect();
    }
  }
  // public async fetchAllTransactions(req: Request, res: Response) {
  //   try {
  //     const transactions = await this.transactionService.getTransactionsService();
  //     return res.status(StatusCodes.OK).json(transactions);
  //   } catch (error) {
  //     console.log(error);
  //     return res
  //       .status(StatusCodes.BAD_GATEWAY)
  //       .json("Something went wrong ! ");
  //   }
  // }
  public async fetchAllTransactions(status: string, page: number, pageSize: number) {
    try {
      const transactions = await this.transactionService.getTransactionsService(status, page, pageSize);
      return transactions;
    } catch (error) {
      throw new Error("something went wrong fetching transactions");
    }
  }
  public async fetchTransactionByIdHandler(id: string) {
    try {
      const transaction = await this.transactionService.getTransactionByIdService(id);

      return transaction;
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong ! ");
    }
  }
  public async fetchArchivedTransactionHandler(req: Request, res: Response) {
    try {
      const transactions = await this.transactionService.getArchivedTransaction();
      res.status(StatusCodes.OK).json(transactions);
    } catch (error) {
      return res.status(StatusCodes.BAD_GATEWAY).json("Something went wrong ! ");
    }
  }
  public async fetchTransactionsByParamsHandler(status: string, accountId: string) {
    try {
      if (status == "INCOMING") {
        const response = await this.transactionService.getIncomingTransactionService(accountId);
        return response;
      }

      const response = await this.transactionService.getReceivedTransactionService(accountId);
      return response;
    } catch (error) {
      throw new Error("something went wrong fetching transactions by params");
    }
  }
  public async archivedTransactionHandler(id: string, userId: string) {
    try {
      const response = await db.$transaction(async (tx) => {
        const result = await this.transactionService.archivedTransactionService(id, userId);
        const payload = cleanedDataUtils(result);
        await this.transactionService.logPostTransaction(payload, tx);

        return result;
      });
      return response;
    } catch (error) {
      console.log(error);
      throw new Error("something went wrong fetching transactions by params");
    }
  }
  public async forwardTransactionHandler(data: z.infer<typeof transactionMutationSchema>, id: string) {
    try {
      if (!id) {
        throw new Error("No ID for forwarding");
      }
      if (!data.receiverId || data.receiverId == data.forwarderId) throw new Error("Please forward the transaction ");

      const receiverInfo = await getUserInfoByAccountId(data.receiverId!);
      const forwarder = await getUserInfoByAccountId(data.forwarderId);

      const attachmentsPercentage = getAttachmentsPercentage(data.attachments);
      const old_attachments = await this.transactionService.fetchTransactionAttachments(data.id!);

      /**
       *
       *
       */
      const updatedAttachments = data.attachments.filter((newAttachment) => {
        if (!newAttachment.fileUrl) return false;
        const oldAttachment = old_attachments.find(
          (oldAttachment) => oldAttachment.fileName.trim().toLocaleLowerCase() === newAttachment.fileName.trim().toLocaleLowerCase(),
        );

        // Check if the old attachment exists
        if (oldAttachment) {
          // If it exists, check if the URLs are different
          return newAttachment.fileUrl.trim().toLocaleLowerCase() !== oldAttachment.fileUrl?.trim().toLocaleLowerCase();
        } else {
          return true;
        }
      });
      const response = await db.$transaction(async (tx) => {
        if (!id) throw new Error("Please provide an ID");
        await this.transactionService.deleteAttachmentByTransaction(id, tx);
        const result = await this.transactionService.forwardTransactionService(data, attachmentsPercentage, tx);
        const payload = cleanedDataUtils(result, forwarder!, receiverInfo!);
        await this.transactionService.logPostTransaction(payload, tx);
        return result;
      });

      const fileToTransfer = updatedAttachments.filter((data) => data.fileUrl);

      if (fileToTransfer.length > 0) {
        await Promise.all(
          fileToTransfer.map(async (attachment) => {
            try {
              const result = await transferFile(attachment.fileUrl!);
              return result;
            } catch (error) {
              console.error(`Failed to transfer file ${attachment.fileUrl}:`, error);
              throw new Error(`Failed to transfer file: ${attachment.fileUrl}`);
            }
          }),
        );
      }
      const notifications = await this.transactionService.fetchAllNotificationById(response.receiverId!);
      const tracker = await this.transactionService.getIncomingTransaction(response.receiverId!);

      const message = "You have a new notification";
      const receiverSocketId = userSockets.get(response.receiverId!);

      const quantityTracker = {
        incoming: tracker.incoming,
        inbox: tracker.outgoing,
      };

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("notification", message, notifications, quantityTracker);
      }

      return response;
    } catch (error) {
      console.error("Error in forwardTransactionHandler:", error);
      throw new Error("Something went wrong ! ");
    } finally {
      await db.$disconnect();
    }
  }

  public async receivedTransactionHandler(id: string, dateReceived: string) {
    try {
      const result = await this.transactionService.receiveTransactionService(id, dateReceived);
      await this.transactionService.receivedLogsService(result.id, result.dateForwarded, result.dateReceived || new Date(), result.receiverId!);

      // await this.transaction
      return result;
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong while receiving transactions");
    }
  }
  public async fetchNotificationsHandler(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const notifications = await this.transactionService.fetchAllNotificationById(id);
      res.status(StatusCodes.OK).json(notifications);
    } catch (error) {
      return res.status(StatusCodes.BAD_GATEWAY).json("Something went wrong ! ");
    }
  }
  public async readAllNotificationHandler(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await this.transactionService.readAllNotificationService(id);
      const notifications = await this.transactionService.fetchAllNotificationById(id);
      res.status(StatusCodes.OK).json(notifications);
    } catch (error) {
      console.log(error);
      return res.status(StatusCodes.BAD_GATEWAY).json("Something went wrong ! ");
    }
  }
  public async countIncomingAndInboxTransactions(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const tracker = await this.transactionService.getIncomingTransaction(id);

      res.status(StatusCodes.OK).json({ incoming: tracker.incoming, inbox: tracker.outgoing });
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.BAD_GATEWAY).json(error);
    }
  }
  public async updateCswById(id: string, data: z.infer<typeof completeStaffWorkMutationSchema>) {
    try {
      const result = await this.transactionService.updateTransactionCswById(id, data);

      return result;
    } catch (error) {
      console.log(error);
      throw new Error("something went wrong calling the services");
    }
  }
  public async transactionEntities(req: Request, res: Response) {
    try {
      const result = await this.transactionService.getDepartmentEntities();
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.BAD_GATEWAY).json(error);
    }
  }

  public async getDashboardData(req: Request, res: Response) {
    try {
      const priority = await this.transactionService.getDashboardPriority();
      const perApplication = await this.transactionService.getNumberPerApplication();
      const perSection = await this.transactionService.getNumberPerSection();
      const total = await this.transactionService.getTotalNumberOfProjects();

      const dashbaordData = [
        {
          category: "Priority",
          data: priority,
        },
        {
          category: "Per Application",
          data: perApplication,
        },
        {
          category: "Per Section",
          data: perSection,
        },
        {
          category: "Total Projects",
          data: total,
        },
      ];

      res.status(StatusCodes.OK).json(dashbaordData);
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.BAD_GATEWAY).json(error);
    }
  }
  public async getTransactionsHandler(query: string, page: number, pageSize: number, status?: string, userId?: string) {
    try {
      const transactions = await this.transactionService.getTransactionsService(query, page, pageSize, status, userId);
      const numOfTransactions = await this.transactionService.countTransactions(query, status, userId);
      const numOfPages = Math.ceil(numOfTransactions / pageSize);
      return { data: transactions!, numOfTransactions: numOfTransactions, totalPages: numOfPages };
    } catch (error) {
      throw new Error("Something went wrong searching transactions");
    }
  }

  public async getTransactionsV2(query: string, page: number, pageSize: number, status?: string, userId?: string) {
    try {
      const transactionsFetched = await this.transactionService.getTransactionServiceV2(query, page, pageSize, status, userId);
      const numOfTransactions = await this.transactionService.countTransactions(query, status, userId);
      const numOfPages = Math.ceil(numOfTransactions / pageSize);
      return { data: transactionsFetched, numOfTransactions: numOfTransactions, totalPages: numOfPages };
    } catch (error) {
      throw new Error("Something went wrong searching transactions");
    }
  }

  public async getTransactionByIdHandler(transactionId: string){
    try {
      const transaction = await this.transactionService.searchTransactionByIdService(transactionId);
      return transaction;
    } catch (error) {
      throw new Error("Something went wrong!");
    }
  }
}
