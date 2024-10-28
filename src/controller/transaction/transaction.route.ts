import express from "express";
import multer from "multer";

// import {
//   forwardTransactionHandler,
//   getCswHandler,
//   getTransactionByParams,
//   getTransactionByParamsHandler,
//   getTransactionHandler,
//   getTransactionsHandler,
//   incomingTransactionHandler,
//   receivedTransactionHandler,
//   transactionFilesHandler,
//   transactionGetSignedUrl,
//   transactionHandler,
//   transactionSignedUrl,
//   updateCswHandler,
// } from "./transaction.controller-v1";
import { TransactionController } from "./transaction.controller-v2";
import { transactionGetSignedUrl, transactionSignedUrl } from "../aws/aws.controller";
// import { restoreEndpoint } from "../../scripts/transaferattachments";
// import { transaferUrl } from "../../scripts/transfer_url";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

const transactionController = new TransactionController();

//transactions v2
// router.get("/v2/", transactionController.fetchAllTransactions.bind(transactionController));

// router.get("/v2/scripts", transaferUrl);
router.get("/v2/dashboardData", transactionController.getDashboardData.bind(transactionController));
// Fetch archived transactions
router.get("/v2/archived", transactionController.fetchArchivedTransactionHandler.bind(transactionController));

// Fetch department entities
router.get("/v2/departmentEntities", transactionController.transactionEntities.bind(transactionController));

// Fetch transaction by ID
router.get("/v2/:id", transactionController.fetchTransactionByIdHandler.bind(transactionController));

// Forward a transaction
// router.put("/v2/:id", transactionController.forwardTransactionHandler.bind(transactionController));

// Update CSW by ID
// router.put("/v2/:id/csw", transactionController.updateCswById.bind(transactionController));

// Mark incoming transaction as received
// router.put("/v2/incoming/:id/received", transactionController.receivedTransactionHandler.bind(transactionController));

// Insert a new transaction
router.post("/v2/", transactionController.insertTransactionHandler.bind(transactionController));

// Count incoming and inbox transactions for a specific ID
router.get("/v2/:id/notification", transactionController.countIncomingAndInboxTransactions.bind(transactionController));

// Fetch transactions by specific parameters for a particular ID
// router.get("/v2/:id/transactions", transactionController.fetchTransactionsByParamsHandler.bind(transactionController));

//get dashboard data

//Aws endpoint

//transaction v1
router.get("/transactionGetUrl", transactionGetSignedUrl);

router.post("/transactionSignedUrl", transactionSignedUrl);
// router.post("/upload", upload.array("files"), transactionFilesHandler);

// router.post("/", validateData(transactionData), transactionHandler);

// router.get("/", getTransactionsHandler);

// router.get("/:id", getTransactionHandler);

// router.get("/incoming/:id", incomingTransactionHandler);

// router.put("/incoming/:id/received",receivedTransactionHandler)

// router.get("/inbox/:id",getTransactionByParamsHandler)

// router.get("/temp/:id",getTransactionByParams);
// router.put("/:id",forwardTransactionHandler)

// //CSW ROUTES
// router.get('/csw/:id',getCswHandler);
// router.put("/:id/csw",updateCswHandler);
export default router;
