import { TFilesData, TtransactionData } from "./transaction.schema";
import { Request, Response } from "express";
import { db } from "../../prisma";
import { uploadToS3 } from "../../services/aws-config";

import { StatusCodes } from "http-status-codes";
import { getDocumentsService, insertTransactionService } from "./transaction.service";

export const transactionFilesHandler = async (req: Request, res: Response) => {
  const files = req.files;
  const fileNames = req.body.fileNames;
  const payload: TFilesData[] = [];
  try {
    if (files && Array.isArray(files) && files.length > 0) {
      const results = await Promise.all(
        files.map((file, index) => uploadToS3(file))
      );
      results.forEach((result, index) => {
        if (result instanceof Error) {
          return;
        }
        payload.push({ ...result, fileName: fileNames[index] });
      });
    }
    res.status(StatusCodes.CREATED).json({ data: payload });
  } catch (error) {
    console.log(error);
    throw new Error("Error uploading files");
  }
};
export const transactionHandler = async (
  req: Request<{}, {}, TtransactionData> & {
    files?:
      | Express.Multer.File[]
      | { [fieldname: string]: Express.Multer.File[] };
  },
  res: Response
) => {
  try {
    const insert = await insertTransactionService(req.body);
    if (insert) {
      res.status(StatusCodes.CREATED).json({ message: "Transaction created" });
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error creating transaction");
  }
};

export const getDocumentsHandler = async (req: Request, res: Response) => {
  try {
      const documents = await getDocumentsService();
      res.status(StatusCodes.OK).json({ data: documents });
  } catch (error) {
    console.log(error);
    console.log(error)
    throw new Error("Error fetching documents");
  }
};
