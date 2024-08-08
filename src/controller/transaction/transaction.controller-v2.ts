import { StatusCodes } from "http-status-codes";
import { TransactionService } from "./transaction.service-v2";
import { Request, Response } from "express";
import {
  transactionData
} from "./transaction.schema";
import { GenerateId } from "../../utils/generate-id";
import { cleanedDataUtils } from "./transaction.utils";
import { db } from "../../prisma";

export class TransactionController {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
  }
  public async insertTransactionHandler(req: Request, res: Response) {
    try {
      const lastId = await this.transactionService.getLastId();

      const generatedId = GenerateId(lastId);

      const data = { ...req.body, transactionId: generatedId };
      console.log(data);
      await db.$transaction(async () => {
        const response = await this.transactionService.insertTransaction(data);
        const validatedData = transactionData.safeParse(response);

        if (!validatedData.success)
          return res
            .status(500)
            .json(
              "something went wrong while validating data after insertion!"
            );
        const payload = cleanedDataUtils(validatedData.data);
        await this.transactionService.logPostTransaction(payload);
        return res.status(StatusCodes.CREATED).json(response);
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
  public async fetchAllTransactions(req: Request, res: Response) {
    try {
    
      const transactions =
        await this.transactionService.getTransactionsService();

      console.log(transactions);
      return res.status(StatusCodes.OK).json(transactions);
    } catch (error) {
      console.log(error);
      return res
        .status(StatusCodes.BAD_GATEWAY)
        .json("Something went wrong ! ");
    }
  }
  public async fetchTransactionByIdHandler(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const transaction =
        await this.transactionService.getTransactionByIdService(id);
      return res.status(StatusCodes.OK).json(transaction);
    } catch (error) {
      return res
        .status(StatusCodes.BAD_GATEWAY)
        .json("Something went wrong ! ");
    }
  }
  public async fetchArchivedTransactionHandler(req:Request,res:Response){
    try {
      const transactions = await this.transactionService.getArchivedTransaction();
      res.status(StatusCodes.OK).json(transactions)
    } catch (error) {
      return res.status(StatusCodes.BAD_GATEWAY).json("Something went wrong ! ")
    }
  }
  public async fetchTransactionsByParamsHandler(req: Request, res: Response) {
    const { option } = req.query;
    const { id } = req.params;

    try {
      if (option == "INCOMING") {
        const response =
          await this.transactionService.getIncomingTransactionService(id);
        return res.status(StatusCodes.OK).json(response);
      } else if (option == "INBOX") {
        const response =
          await this.transactionService.getReceivedTransactionService(id);
        return res.status(StatusCodes.OK).json(response);
      }
    } catch (error) {
      return res
        .status(StatusCodes.BAD_GATEWAY)
        .json("Something went wrong ! ");
    }
  }
  public async forwardTransactionHandler(req: Request, res: Response) {
    try {
      await db.$transaction(async () => {
        const result = await this.transactionService.forwardTransactionService(
          req.body
        );
        const validatedData = transactionData.safeParse(result);

        if (!validatedData.success)
          return res
            .status(500)
            .json(
              "something went wrong while validating data after forwarding !"
            );
        const payload = cleanedDataUtils(validatedData.data);
        await this.transactionService.logPostTransaction(payload);
        return res.status(StatusCodes.CREATED).json(result);
      });
    } catch (error) {}
  }
  public async receivedTransactionHandler(req: Request, res: Response) {
    const { id } = req.params;
    const { dateReceived } = req.body;

    try {
      const result = await this.transactionService.receiveTransactionService(
        id,
        dateReceived
      );

      console.log(
        result.transactionId,
        result.dateForwarded,
        result.dateReceived || new Date(),
        result.receiver.id
      );

      await this.transactionService.receivedLogsService(
        result.id,
        result.dateForwarded,
        result.dateReceived || new Date(),
        result.receiver.id
      );
      res.status(StatusCodes.OK).json(result.id);
    } catch (error) {
      return res
        .status(StatusCodes.BAD_GATEWAY)
        .json("Something went wrong ! ");
    }
  }

  public async countIncomingAndInboxTransactions(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const {incomingCount,outgoingCount} = await this.transactionService.getIncomingTransaction(id);

      res.status(StatusCodes.OK).json({ incoming:incomingCount, inbox:outgoingCount });
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.BAD_GATEWAY).json(error);
    }
  }
  public async updateCswById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const result = await this.transactionService.updateTransactionCswById(
        id,
        req.body
      );
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
}
