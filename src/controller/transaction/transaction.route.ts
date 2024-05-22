import express from "express";
import multer from "multer";

import { validateData } from "../../middleware/zodValidation";
import { transactionData} from "./transaction.schema";
import {
  getDocumentsHandler,
  transactionFilesHandler,
  transactionHandler,
} from "./transaction.controller";
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.array("files"), transactionFilesHandler);

router.post("/", validateData(transactionData), transactionHandler);

router.get("/", getDocumentsHandler )

export default router;
