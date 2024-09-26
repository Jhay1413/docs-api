"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
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
const transaction_controller_v2_1 = require("./transaction.controller-v2");
const aws_controller_1 = require("../aws/aws.controller");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const transactionController = new transaction_controller_v2_1.TransactionController();
//transactions v2
router.get("/v2/", transactionController.fetchAllTransactions.bind(transactionController));
router.get("/v2/dashboardData", transactionController.getDashboardData.bind(transactionController));
// Fetch archived transactions
router.get("/v2/archived", transactionController.fetchArchivedTransactionHandler.bind(transactionController));
// Fetch department entities
router.get("/v2/departmentEntities", transactionController.transactionEntities.bind(transactionController));
// Fetch transaction by ID
router.get("/v2/:id", transactionController.fetchTransactionByIdHandler.bind(transactionController));
// Forward a transaction
router.put("/v2/:id", transactionController.forwardTransactionHandler.bind(transactionController));
// Update CSW by ID
router.put("/v2/:id/csw", transactionController.updateCswById.bind(transactionController));
// Mark incoming transaction as received
router.put("/v2/incoming/:id/received", transactionController.receivedTransactionHandler.bind(transactionController));
// Insert a new transaction
router.post("/v2/", transactionController.insertTransactionHandler.bind(transactionController));
// Count incoming and inbox transactions for a specific ID
router.get("/v2/:id/notification", transactionController.countIncomingAndInboxTransactions.bind(transactionController));
// Fetch transactions by specific parameters for a particular ID
router.get("/v2/:id/transactions", transactionController.fetchTransactionsByParamsHandler.bind(transactionController));
// Fetch notifications related to a specific transaction ID
router.get("/v2/:id/notifications", transactionController.fetchNotificationsHandler.bind(transactionController));
//read all notification
router.put("/v2/:id/readNotification", transactionController.readAllNotificationHandler.bind(transactionController));
//get dashboard data
//Aws endpoint
//transaction v1
router.get("/transactionGetUrl", aws_controller_1.transactionGetSignedUrl);
router.post("/transactionSignedUrl", aws_controller_1.transactionSignedUrl);
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
exports.default = router;
