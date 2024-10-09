import { contracts } from "shared-contract";
import { s } from "../..";
import { createExpressEndpoints } from "@ts-rest/express";
import { fetchUserByRoleAccess } from "./user.controller";

const userInfoRouter = s.router(contracts.userAccounts, {
  getUserByRoleAccess: async ({ query }) => {
    try {
      console.log(query);
      const result = await fetchUserByRoleAccess(query.id, query.targetDivision, query.team);

      return {
        status: 200,
        body: result,
      };
    } catch (error) {
      return {
        status: 500,
        body: {
          error: "something went wrong ! ",
        },
      };
    }
  },
  getUserInfoForSelect: async ({ query }) => {
    console.log("fethching");
    try {
      const result: any = {};
      return {
        status: 201,
        body: result,
      };
    } catch (error) {
      return {
        status: 501,
        body: {
          error: "something went wrong",
        },
      };
    }
  },
});
export const registerUserRoutes = (app: any) => {
  createExpressEndpoints(contracts.userAccounts, userInfoRouter, app);
};
