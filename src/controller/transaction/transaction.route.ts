import express from "express";
import multer from "multer";

import { validateData } from "../../middleware/zodValidation";
import { transactionData } from "./transaction.schema";
import {

  forwardTransactionHandler,
  getCswHandler,
  getTransactionByParams,
  getTransactionByParamsHandler,
  getTransactionHandler,
  getTransactionsHandler,
  incomingTransactionHandler,
  receivedTransactionHandler,
  transactionFilesHandler,
  transactionGetSignedUrl,
  transactionHandler,
  transactionSignedUrl,
  updateCswHandler,
} from "./transaction.controller";
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get("/transactionGetUrl",transactionGetSignedUrl)

router.post("/transactionSignedUrl" ,transactionSignedUrl )
router.post("/upload", upload.array("files"), transactionFilesHandler);

router.post("/", validateData(transactionData), transactionHandler);

router.get("/", getTransactionsHandler);

router.get("/:id", getTransactionHandler);

router.get("/incoming/:id", incomingTransactionHandler);

router.put("/incoming/:id/received",receivedTransactionHandler)

router.get("/inbox/:id",getTransactionByParamsHandler)


router.get("/temp/:id",getTransactionByParams);
router.put("/:id",forwardTransactionHandler)


//CSW ROUTES
router.get('/csw/:id',getCswHandler);
router.put("/:id/csw",updateCswHandler);
export default router;
