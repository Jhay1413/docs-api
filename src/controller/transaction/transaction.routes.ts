import { createExpressEndpoints, initServer } from "@ts-rest/express";
import {
  contracts,
  transactionContract,
  transactionQueryData,
} from "shared-contract";

import z from "zod";
import { TransactionService } from "./transaction.service-v2";
import { s } from "../..";
import { TransactionController } from "./transaction.controller-v2";

const transactionService = new TransactionService();
const transactionController = new TransactionController();
const transactionRouter = s.router(contracts.transaction, {
  fetchTransactions: async () => {
    try {
      const result =
        (await transactionService.getTransactionsService()) as z.infer<
          typeof transactionQueryData
        >[];

      return {
        status: 200,
        body: result,
      };
    } catch (error) {
      return {
        status: 500,
        body: {
          error: "something went wrong ",
        },
      };
    }
  },
  insertTransacitons: async ({ body }) => {
    try {
      console.log(body);
      const result = await transactionController.insertTransactionHandler(body);
        console.log(result);
      return {
        status: 200,
        body: result,
      };
    } catch (error) {
      return {
        status: 501,
        body: {
          error: error,
        },
      };
    }
  },
  fetchTransactionById: async ({ params }) => {
    try {
      const result = await transactionController.fetchTransactionByIdHandler(
        params.id
      );
      
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

  updateTransaction : async({body})=>{
    try {
      const result = await transactionController.forwardTransactionHandler(body);
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
  searchTransactions:async({params})=>{
    try {
      const result = await transactionController.getSearchedTransation(params.query)
      return {
        status: 201,
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
  }
});
export const registerTransactionRoutes = (app: any) => {
  createExpressEndpoints(contracts.transaction, transactionRouter, app);
};
