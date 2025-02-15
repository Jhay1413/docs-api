import { createExpressEndpoints } from "@ts-rest/express";

import { TransactionController } from "./transaction.controller-v2";
import s from "../../utils/ts-rest-server";
import { disableAfter5PM } from "../../middleware/time-checker";
import { contracts } from "shared-contract";

const transactionController = new TransactionController();
const transactionRouter = s.router(contracts.transaction, {
  archivedTransaction: async ({ params, body }) => {
    try {
      await transactionController.archivedTransactionHandler(params.id, body.userId);

      return {
        status: 200,
        body: {
          message: "Data has been archived successully ! ",
        },
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
  addCompleteStaffWork: async ({ params, body }) => {
    try {
      await transactionController.updateCswById(params.id, body);

      return {
        status: 201,
        body: {
          message: "Data Added ! ",
        },
      };
    } catch (error) {
      return {
        status: 500,
        body: {
          error: "something went wrongssss",
        },
      };
    }
  },
  getTransactionByParams: async ({ query }) => {
    try {
      const result = await transactionController.fetchTransactionsByParamsHandler(query.status, query.accountId);
      return {
        status: 200,
        body: result,
      };
    } catch (error) {
      return {
        status: 500,
        body: {
          error: "something went wrongssss",
        },
      };
    }
  },
  receivedTransaction: async ({ params, body }) => {
    try {
      const result = await transactionController.receivedTransactionHandler(params.id, body.dateReceived);
      return {
        status: 200,
        body: result,
      };
    } catch (error) {
      return {
        status: 500,
        body: {
          error: "something went wrongssss",
        },
      };
    }
  },
  fetchTransactionsV2: async ({ query }) => {
    try {
      const page = parseInt(query.page, 10);
      const pageSize = parseInt(query.pageSize, 10);

      const result = await transactionController.getTransactionsV2(query.query, page, pageSize, query.status, query.userId);
      return {
        status: 201,
        body: result!,
      };
    } catch (error) {
      return {
        status: 500,
        body: {
          error: "Something went wrong",
        },
      };
    }
  },
  searchTransactionById: async ({ query }) => {
    try {
      const result = await transactionController.getTransactionByIdHandler(query.transactionId,query.projectId);
      return {
        status: 200,
        body: result,
      };
    } catch (error) {
      return {
        status: 500,
        body: {
          error: "Something went wrong",
        },
      };
    }
  },
  fetchTransactionById: async ({ params }) => {
    try {
      const result = await transactionController.fetchTransactionByIdHandler(params.id);

      // const new_csw = result.completeStaffWork.sort((a, b) => {
      //   const dateA = new Date(a.date);
      //   const dateB = new Date(b.date);
      //   return dateA.getTime() - dateB.getTime();
      // });

      return {
        status: 200,
        body: result,
      };
    } catch (error) {
      return {
        status: 500,
        body: {
          error: "something went wrong",
        },
      };
    }
  },
  // fetchTransactions: async () => {
  //   try {
  //     const result = await transactionController.fetchAllTransactions();

  //     return {
  //       status: 200,
  //       body: result,
  //     };
  //   } catch (error) {
  //     return {
  //       status: 500,
  //       body: {
  //         error: "something went wrong ",
  //       },
  //     };
  //   }
  // },
  insertTransactions: async ({ body }) => {
    try {
      const result = await transactionController.insertTransactionHandler(body);
      return {
        status: 200,
        body: result,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 501,
        body: {
          error: error,
        },
      };
    }
  },

  updateTransaction: async ({ body, params }) => {
    try {
      await transactionController.forwardTransactionHandler(body, params.id);

      return {
        status: 200,
        body: {
          success: "data updated Successfully",
        },
      };
    } catch (error) {
      return {
        status: 500,
        body: {
          error: "something went wrong",
        },
      };
    }
  },
});
export const registerTransactionRoutes = (app: any) => {
  createExpressEndpoints(contracts.transaction, transactionRouter, app);
};
