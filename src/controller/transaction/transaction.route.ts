import express from "express";
import multer from "multer";

import { validateData } from "../../middleware/zodValidation";
import { transactionData } from "./transaction.schema";
import {

  getTransactionHandler,
  getTransactionsHandler,
  incomingTransactionHandler,
  receivedTransactionHandler,
  transactionFilesHandler,
  transactionHandler,
} from "./transaction.controller";
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.array("files"), transactionFilesHandler);

router.post("/", validateData(transactionData), transactionHandler);

router.get("/", getTransactionsHandler);

router.get("/:id", getTransactionHandler);

router.get("/incoming/:id", incomingTransactionHandler);

router.put("/incoming/:id/received",receivedTransactionHandler)
export default router;
