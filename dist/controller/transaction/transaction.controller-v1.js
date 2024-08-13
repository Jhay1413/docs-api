"use strict";
// import {
//   paramsRequestData,
//   TFilesData,
//   transactionData,
// } from "./transaction.schema";
// import { Request, Response } from "express";
// import {
//   getSignedUrlFromS3,
//   getUploadSignedUrlFromS3,
//   uploadToS3,
// } from "../../services/aws-config";
// import { StatusCodes } from "http-status-codes";
// import {
//   getTransactionService,
//   getLastId,
//   insertTransactionService,
//   getTransactionById,
//   getUserInfo,
//   getIncomingTransactionByManager,
//   receiveTransactionById,
//   logPostTransactions,
//   getReceivedTransactions,
//   fetchTransactions,
//   forwardTransaction,
//   receivedLatestLogs,
//   fetchCSWByTransactionId,
//   updateTransactionCswById,
// } from "./transaction.service-v1";
// import { GenerateId } from "../../utils/generate-id";
// export const transactionGetSignedUrl = async(req:Request,res:Response)=>{
//   const {key} = req.query
//   try {
//     const signedUrl = await getSignedUrlFromS3(key as string);
//     res.status(StatusCodes.OK).json(signedUrl)
//   } catch (error) {
//     res.status(StatusCodes.GATEWAY_TIMEOUT).json(error)
//   }
// }
// export const transactionSignedUrl = async (req: Request, res: Response) => {
//   const data = req.body;
//   console.log(data);
//   try {
//     const validateData = paramsRequestData.safeParse(data);
//     if (!validateData.success) {
//       console.log(validateData.error);
//       return res
//         .status(StatusCodes.BAD_REQUEST)
//         .json("Invalid Data on request");
//     }
//     const signedUrls = await Promise.all(
//       validateData.data.map(async (data) => {
//         try {
//           const {key,url} = await getUploadSignedUrlFromS3(
//             data.company,
//             data.fileName
//           );
//           return { ...data, key,signedUrl:url,signedStatus:true };
//         } catch (error) {
//           console.error(
//             `Error fetching signed URL for ${data.fileName}:`,
//             error
//           );
//           return { ...data, signedStatus: false };
//         }
//       })
//     );
//     res.status(StatusCodes.CREATED).json(signedUrls);
//   } catch (error) {
//     res.status(StatusCodes.BAD_GATEWAY).json(error);
//   }
// };
// export const transactionFilesHandler = async (req: Request, res: Response) => {
//   const files = req.files;
//   const fileNames = req.body.fileNames;
//   const payload: TFilesData[] = [];
//   console.log(files);
//   try {
//     if (files && Array.isArray(files) && files.length > 0) {
//       const results = await Promise.all(
//         files.map((file, index) => uploadToS3(file))
//       );
//       results.forEach((result, index) => {
//         if (result instanceof Error) {
//           return;
//         }
//         payload.push({ ...result, fileName: fileNames[index] });
//       });
//     }
//     res.status(StatusCodes.CREATED).json({ data: payload });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json(error);
//   }
// };
// //Done need tests
// export const transactionHandler = async (req: Request, res: Response) => {
//   try {
//     const lastId = await getLastId();
//     const generatedId = GenerateId(lastId);
//     const data = { ...req.body, transactionId: generatedId };
//     const response = await insertTransactionService(data);
//     // const stringfyData =JSON.stringify(response);
//     // const logResult = await logPostTransactionsV2("POST",response.id,response.forwardedById,stringfyData);
//     // console.log(logResult)
//     const validatedData = transactionData.safeParse(response);
//     console.log(validatedData.error?.errors);
//     if (validatedData.error) {
//       return res.status(500).json("something went wrong!");
//     }
//     const cleanedData = {
//       ...validatedData.data,
//       company: validatedData.data.company?.companyName!,
//       project: validatedData.data.project?.projectName!,
//       forwardedBy: validatedData.data.forwarder!.email,
//       attachments: validatedData.data.attachments!,
//       receivedBy: validatedData.data.receive?.email || null,
//       transactionId: validatedData.data.id!,
//     };
//     const { receivedById, receive, forwarder, id, ...payload } = cleanedData;
//     const logData = await logPostTransactions(payload);
//     return res.status(StatusCodes.CREATED).json(response);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json(error);
//   }
// };
// export const getTransactionsHandler = async (req: Request, res: Response) => {
//   try {
//     const documents = await getTransactionService();
//     res.status(StatusCodes.OK).json(documents);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json(error);
//   }
// };
// //Done 
// export const getTransactionHandler = async (req: Request, res: Response) => {
//   try {
//     console.log("refetch")
//     const transaction = await getTransactionById(req.params.id);
//     res.status(200).json(transaction);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json(error);
//   }
// };
// export const incomingTransactionHandler = async (
//   req: Request,
//   res: Response
// ) => {
//   try {
//     const user = await getUserInfo(req.params.id);
//     if (user?.accountRole === "MANAGER") {
//       if (!user.userInfo?.assignedDivision) {
//         return res
//           .status(404)
//           .json("Current user was not assigned on any division");
//       }
//       const transactions = await getIncomingTransactionByManager(
//         user.accountRole,
//         user.userInfo.assignedDivision
//       );
//       return res.status(200).json(transactions);
//     }
//     return res.status(200).json("some");
//   } catch (error) {
//     return res.status(500).json(error);
//   }
// };
// export const receivedTransactionHandler = async (
//   req: Request,
//   res: Response
// ) => {
//   const { receivedBy, dateReceived } = req.body;
//   const transactionId = req.params.id;
//   try {
//     const result = await receiveTransactionById(
//       transactionId,
//       receivedBy,
//       dateReceived
//     );
//     await receivedLatestLogs(result.id,dateReceived,result.receiver?.email!)
//     res.status(StatusCodes.ACCEPTED).json(result.id);
//   } catch (error) {
//     res.status(StatusCodes.CONFLICT).json(error);
//   }
// };
// export const getTransactionByParamsHandler = async (
//   req: Request,
//   res: Response
// ) => {
//   const { id } = req.params;
//   try {
//     const user = await getUserInfo(id);
//     if (!user) return res.status(404).json("User not found");
//     const result = await getReceivedTransactions(user.id);
//     res.status(200).json(result);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// };
// //Done need tests
// type TransactionFilterOptions = "INCOMING" | "INBOX";
// export const getTransactionByParams = async (req: Request, res: Response) => {
//   const { option } = req.query;
//   const id = req.params.id;
//   try {
//     const userInfo = await getUserInfo(id);
//     const response = await fetchTransactions(
//       id,
//       userInfo?.userInfo!.assignedDivision,
//       userInfo?.accountRole,
//       option as TransactionFilterOptions
//     );
//     console.log(response);
//     res.status(StatusCodes.OK).json(response);
//   } catch (error) {
//     res.status(StatusCodes.BAD_GATEWAY).json(error);
//   }
// };
// export const forwardTransactionHandler = async (
//   req: Request,
//   res: Response
// ) => {
//   try {
//     const result = await forwardTransaction(req.body);
//     const validatedData = transactionData.safeParse(result);
//     console.log(validatedData.error?.errors);
//     if (validatedData.error) {
//       return res.status(500).json("something went wrong!");
//     }
//     console.log(validatedData.data);
//     const cleanedData = {
//       ...validatedData.data,
//       company: validatedData.data.company?.companyName!,
//       project: validatedData.data.project?.projectName!,
//       forwardedBy: validatedData.data.forwarder!.email,
//       attachments: validatedData.data.attachments!,
//       receivedBy: validatedData.data.receive?.email || null,
//       transactionId: validatedData.data.id!,
//     };
//     const { receivedById, receive, forwarder, id, ...payload } = cleanedData;
//     const logData = await logPostTransactions(payload);
//     res.status(StatusCodes.OK).json(result);
//   } catch (error) {
//     res.status(StatusCodes.BAD_GATEWAY).json(error);
//   }
// };
// //CSW CONTROLLER
// export const getCswHandler = async (req:Request,res:Response) =>{
//   const {id} = req.params
//   try {
//     const result = await fetchCSWByTransactionId(id);
//     res.status(StatusCodes.CONTINUE).json(result)
//   } catch (error) {
//     res.status(StatusCodes.BAD_GATEWAY).json(error)
//   }
// }
// export const updateCswHandler = async (req:Request,res:Response)=>{
//   const {id} = req.params;
//   try {
//     const result = await updateTransactionCswById(id,req.body)
//     console.log(result)
//     res.status(StatusCodes.CREATED).json(result);
//   } catch (error) {
//     res.status(StatusCodes.BAD_GATEWAY).json(error) 
//   }
// }
