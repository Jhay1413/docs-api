import { StatusCodes } from "http-status-codes";
import { TransactionService } from "./transaction.service-v2";
import { Request, Response } from "express";
import * as z from "zod";
import { getUserInfo } from "./transaction.service-v1";
export class TransactionController {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
  }

  public async fetchAllTransactions(req: Request, res: Response) {
    try {
      const transactions =
        await this.transactionService.getTransactionsService();
      return res.status(StatusCodes.OK).json(transactions);
    } catch (error) {
      console.log(error);
      return res
        .status(StatusCodes.BAD_GATEWAY)
        .json("Something went wrong ! ");
    }
  }
  public async fetchTransactionById(req: Request, res: Response) {
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
  public async countIncomingAndInboxTransactions(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const userInfo = await getUserInfo(id);
      console.log(userInfo);
      const incoming = await this.transactionService.getIncomingTransaction(
        undefined,
        userInfo?.userInfo?.assignedDivision,
        userInfo?.accountRole
      );
     
      const inbox = await this.transactionService.getReceivedTransaction(
        id,
        userInfo?.userInfo!.assignedDivision!,
        userInfo?.accountRole!
      );

      res.status(StatusCodes.OK).json({ incoming, inbox });
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
}
