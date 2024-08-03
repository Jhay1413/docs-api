import { Request, Response } from "express";
import {
  getSignedUrlFromS3,
  getUploadSignedUrlFromS3,
} from "../../services/aws-config";
import { StatusCodes } from "http-status-codes";
import { paramsRequestData } from "../transaction/transaction.schema";

const transactionGetSignedUrl = async (req: Request, res: Response) => {
  const { key } = req.query;
  try {
    const signedUrl = await getSignedUrlFromS3(key as string);
    res.status(StatusCodes.OK).json(signedUrl);
  } catch (error) {
    res.status(StatusCodes.GATEWAY_TIMEOUT).json(error);
  }
};
const transactionSignedUrl = async (req: Request, res: Response) => {
  const data = req.body;
  console.log(data);
  try {
    const validateData = paramsRequestData.safeParse(data);

    if (!validateData.success) {
      console.log(validateData.error);
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json("Invalid Data on request");
    }

    const signedUrls = await Promise.all(
      validateData.data.map(async (data) => {
        try {
          const { key, url } = await getUploadSignedUrlFromS3(
            data.company,
            data.fileName
          );
          return { ...data, key, signedUrl: url, signedStatus: true };
        } catch (error) {
          console.error(
            `Error fetching signed URL for ${data.fileName}:`,
            error
          );
          return { ...data, signedStatus: false };
        }
      })
    );

    res.status(StatusCodes.CREATED).json(signedUrls);
  } catch (error) {
    res.status(StatusCodes.BAD_GATEWAY).json(error);
  }
};


export {
    transactionGetSignedUrl,
    transactionSignedUrl
}