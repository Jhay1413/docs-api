import s from "../../utils/ts-rest-server";
import { contracts } from "shared-contract";
import { transactionSignedUrlV2, uploadSingleFile } from "./aws.controller";
import { createExpressEndpoints } from "@ts-rest/express";
import multer from "multer";
const upload = multer();
const fileRouter = s.router(contracts.awsContract, {
  getSignedUrl: async ({ query }) => {
    try {
      const response = await transactionSignedUrlV2(query.company, query.fileName, query.fileType);
      return {
        status: 200,
        body: { ...response, fileType: query.fileType, fileName: query.fileName, company: query.company },
      };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        body: {
          error: "Something went wrong ",
        },
      };
    }
  },
  uploadDocument: {
    middleware: [upload.single("thumbnail")],
    handler: async ({ file, body }) => {
      const document = file as Express.Multer.File;
      const result = await uploadSingleFile(body.company, body.fileName, document);
      return {
        status: 200,
        body: { key: result.response },
      };
    },
  },
});
export const registerFileRoutes = (app: any) => {
  createExpressEndpoints(contracts.awsContract, fileRouter, app);
};
