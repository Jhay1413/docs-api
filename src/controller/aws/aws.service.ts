import { PutObjectCommand, S3Client, S3, CopyObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { generateFileName } from "../../utils/utils";
import AWS from "aws-sdk";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
const config = {
  region: "ap-southeast-2",
  credentials: {
    accessKeyId: process.env.TEMP_BUCKET_KEY!,
    secretAccessKey: process.env.TEMP_BUCKET_PRIVATE_KEY!,
  },
};
const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.TEMP_BUCKET_KEY!,
    secretAccessKey: process.env.TEMP_BUCKET_PRIVATE_KEY!,
  },
});

export const s3SignedUrl = new S3Client(config);
export const uploadFileService = async (company: string, fileName: string, contentType: string, file: Express.Multer.File): Promise<string> => {
  try {
    const generatedFilename = generateFileName();
    const key = `${company}/${generatedFilename}.${fileName}`;
    const params = {
      Bucket: process.env.TEMP_BUCKET_NAME!,
      Key: key,
      ContentType: contentType,
      Body: file.buffer,
    };

    return new Promise((resolve, reject) => {
      s3.upload(params, {}, (error, data) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve(key);
        }
      });
    });
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong while uploading .");
  }
};

export const getViewSignedUrlService = async (key: string) => {
  try {
    const getObjectCommand = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME!,
      Key: key,
    });
    console.log(getObjectCommand);
    const signedURL = await getSignedUrl(s3SignedUrl, getObjectCommand, {
      expiresIn: 60 * 60,
    });
    return signedURL;
  } catch (error) {
    throw new Error("Error getting signed url from S3");
  }
};
export const getUploadSignedUrlV2 = async (company: string, fileName: string, contentType: string) => {
  try {
    const generatedFilename = generateFileName();
    const key = `${company}/${fileName}${generatedFilename}`;
    const command = new PutObjectCommand({
      Bucket: process.env.TEMP_BUCKET_NAME!,
      Key: key,
      ContentType: contentType,
    });
    // const signedUrl = await getSignedUrl(s3, command, {
    //   expiresIn: 3600,
    // });
    return { signedUrl: "test", key };
  } catch (error) {
    console.log(error);
    throw new Error("Error getting signed url from S3");
  }
};

export const transferFile = async (fileUrl: string) => {
  try {
    const params = {
      Bucket: process.env.BUCKET_NAME!,
      Key: fileUrl,
      CopySource: `${process.env.TEMP_BUCKET_NAME}/${fileUrl}`,
    };
    return new Promise((resolve, reject) => {
      s3.copyObject(params, (error, data) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve("success");
        }
      });
    });
  } catch (error) {
    throw new Error("Something went wrong while copying file .");
  }
};
