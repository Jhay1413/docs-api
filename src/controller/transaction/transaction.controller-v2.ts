import { StatusCodes } from "http-status-codes";
import { TransactionService } from "./transaction.service-v2";
import { Request, Response } from "express";
import { notification } from "./transaction.schema";
import { GenerateId } from "../../utils/generate-id";
import { cleanedDataUtils } from "./transaction.utils";
import { db } from "../../prisma";
import z from "zod";
import { io, userSockets } from "../..";
import { transactionMutationSchema, transactionQueryData } from "shared-contract";
export class TransactionController {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
  }
  public async insertTransactionHandler(data: z.infer<typeof transactionMutationSchema>) {
    try {
      const lastId = await this.transactionService.getLastId();
      const generatedId = GenerateId(lastId);
      const data_payload = { ...data, transactionId: generatedId };

      const attachment_log_payload = data.attachments.map((data) => {
        return {
          ...data,
          createdAt: new Date().toISOString(),
        };
      });
      const response = await db.$transaction(async (tx) => {
        const transaction = await this.transactionService.insertTransaction(data_payload, tx);

        const payload = cleanedDataUtils({ ...transaction, attachments: attachment_log_payload });

        await this.transactionService.logPostTransaction(payload, tx);

        if (transaction.status === "ARCHIVED" || !transaction.receiverId) return;

        const notificationPayload = {
          transactionId: transaction.id,
          message: `New Transaction Forwarded by ${transaction.forwarder.accountRole}`,
          receiverId: transaction.receiverId,
          forwarderId: transaction.forwarderId,
          isRead: false,
        } as z.infer<typeof notification>;

        await this.transactionService.addNotificationService(notificationPayload, tx);

        return transaction;
      });

      if (!response) throw new Error("Something went wrong inserting data !");
      if (response.status === "ARCHIVED") return response;

      const notifications = await this.transactionService.fetchAllNotificationById(response.receiverId!);
      const { incomingCount, outgoingCount } = await this.transactionService.getIncomingTransaction(response.receiverId!);
      const message = "You have new notification";
      const receiverSocketId = userSockets.get(response.receiverId!);

      const quantityTracker = {
        incoming: incomingCount,
        inbox: outgoingCount,
      };
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("notification", message, notifications, quantityTracker);
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

      const validateData = transactionQueryData.safeParse(transaction);

      if (validateData.error) {
        console.log(validateData.error.errors);
        throw new Error("Something went wrong ! ");
      }

      return validateData.data;
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
  public async forwardTransactionHandler(data: z.infer<typeof transactionMutationSchema>) {
    try {
      // Start the transaction
      const response = await db.$transaction(async (tx) => {
        const result = await this.transactionService.forwardTransactionService(data, tx);
        const payload = cleanedDataUtils(result);
        await this.transactionService.logPostTransaction(payload, tx);

        if (result.status === "ARCHIVED" || !result.receiverId) {
          return result; // Early return if not needing further actions
        }

        const notificationPayload = {
          transactionId: result.id,
          message: `New Transaction Forwarded by ${result.forwarder?.accountRole}`,
          receiverId: result.receiverId,
          forwarderId: result.forwarder?.id,
          isRead: false,
        } as z.infer<typeof notification>;

        await this.transactionService.addNotificationService(notificationPayload);

        return result;
      });

      // After the transaction has completed
      if (response.status === "ARCHIVED" || !response.receiverId) {
        return response;
      }

      const notifications = await this.transactionService.fetchAllNotificationById(response.receiverId!);
      const { incomingCount, outgoingCount } = await this.transactionService.getIncomingTransaction(response.receiverId!);

      const message = "You have a new notification";
      const receiverSocketId = userSockets.get(response.receiverId);

      const quantityTracker = {
        incoming: incomingCount,
        inbox: outgoingCount,
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
      console.log(result);
      await this.transactionService.receivedLogsService(result.id, result.dateForwarded, result.dateReceived || new Date(), result.receiverId!);
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
      const { incomingCount, outgoingCount } = await this.transactionService.getIncomingTransaction(id);

      res.status(StatusCodes.OK).json({ incoming: incomingCount, inbox: outgoingCount });
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.BAD_GATEWAY).json(error);
    }
  }
  public async updateCswById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const result = await this.transactionService.updateTransactionCswById(id, req.body);
      res.status(StatusCodes.CREATED).json(result);
    } catch (error) {
      res.status(StatusCodes.BAD_GATEWAY).json(error);
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
      console.log("asdasdsas");
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
  public async getSearchedTransation(query: string, page: number, pageSize: number, status?: string) {
    try {
      const transactions = await this.transactionService.searchTransaction(query, page, pageSize, status);
      if (!transactions) return null;
      return transactions;
    } catch (error) {
      throw new Error("Something went wrong searching transactions");
    }
  }
}
