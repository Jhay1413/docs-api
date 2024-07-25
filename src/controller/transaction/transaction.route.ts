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
} from "./transaction.controller-v1";
import { TransactionController } from "./transaction.controller-v2";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });


const transactionController = new TransactionController();

//transactions v2

router.get("/v2/",transactionController.fetchAllTransactions.bind(transactionController) );
router.get("/v2/:id",transactionController.fetchTransactionById.bind(transactionController))
router.put("/v2/:id/csw",transactionController.updateCswById.bind(transactionController))

//transaction v1
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
