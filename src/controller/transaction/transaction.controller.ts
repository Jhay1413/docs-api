import { TFilesData, transactionData } from "./transaction.schema";
import { Request, Response } from "express";
import { uploadToS3 } from "../../services/aws-config";
import { StatusCodes } from "http-status-codes";
import {
  getTransactionService,
  getLastId,
  insertTransactionService,
  getTransactionById,
  getUserInfo,
  getIncomingTransactionByManager,
  receiveTransactionById,
  logPostTransactions,
  getReceivedTransactions,
} from "./transaction.service";
import { GenerateId } from "../../utils/generate-id";

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
    return res.status(500).json(error);
  }
};
export const transactionHandler = async (req: Request, res: Response) => {
  try {
    const lastId = await getLastId();

    const generatedId = GenerateId(lastId);

    const data = { ...req.body, transactionId: generatedId };
    const response = await insertTransactionService(data);

    const validatedData = transactionData.safeParse(response);
    console.log(validatedData.error?.errors);
    if (validatedData.error) {
      return res.status(500).json("something went wrong!");
    }
    console.log(validatedData.data);
    const cleanedData = {
      ...validatedData.data,
      company: validatedData.data.company?.companyName!,
      project: validatedData.data.project?.projectName!,
      forwardedBy: validatedData.data.forwarder!.email,
      attachments: validatedData.data.attachment!,
      receivedBy: validatedData.data.receive?.email || null,
      transactionId: validatedData.data.id!,
    };

    const { receivedById, receive, forwarder, id, ...payload } = cleanedData;

    const logData = await logPostTransactions(payload);

    return res.status(StatusCodes.CREATED).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const getTransactionsHandler = async (req: Request, res: Response) => {
  try {
    const documents = await getTransactionService();

    res.status(StatusCodes.OK).json(documents);
  } catch (error) {
    console.log(error);
    console.log(error);
    return res.status(500).json(error);
  }
};
export const getTransactionHandler = async (req: Request, res: Response) => {
  console.log(req.params.id);
  try {
    const transaction = await getTransactionById(req.params.id);
    console.log(transaction);
    res.status(200).json(transaction);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const incomingTransactionHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const user = await getUserInfo(req.params.id);
    console.log(user?.accountRole);
    if (user?.accountRole === "MANAGER") {
      if (!user.userInfo?.assignedDivision) {
        return res
          .status(404)
          .json("Current user was not assigned on any division");
      }
      const transactions = await getIncomingTransactionByManager(
        user.accountRole,
        user.userInfo.assignedDivision
      );
      return res.status(200).json(transactions);
    }
    return res.status(200).json("some");
  } catch (error) {
    return res.status(500).json(error);
  }
};
export const receivedTransactionHandler = async (
  req: Request,
  res: Response
) => {
  const { receivedBy, dateReceived } = req.body;
  const transactionID = req.params.id;
  try {
    const result = await receiveTransactionById(
      transactionID,
      receivedBy,
      dateReceived
    );
    const validatedData = transactionData.safeParse(result);
    console.log(validatedData.error?.errors);
    if (validatedData.error) {
      return res.status(500).json("something went wrong!");
    }

    const cleanedData = {
      ...validatedData.data,
      company: validatedData.data.company?.companyName!,
      project: validatedData.data.project?.projectName!,
      forwardedBy: validatedData.data.forwarder!.email,
      attachments: validatedData.data.attachment!,
      receivedBy: validatedData.data.receive?.email || null,
      transactionId: validatedData.data.id!,
    };

    const { receivedById, receive, forwarder, id, ...payload } = cleanedData;

    await logPostTransactions(payload);

    res.status(200).json(validatedData.data.id);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getTransactionByParamsHandler = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  try {
    const user = await getUserInfo(id);
    if (!user) return res.status(404).json("User not found");
    const result = await getReceivedTransactions(user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};
