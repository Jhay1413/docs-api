import { contracts } from "shared-contract";
import { s } from "../..";
import { createExpressEndpoints } from "@ts-rest/express";
import { fetchUserByRoleAccess, fetchUsersForTicketForwarding } from "./user.controller";

const userInfoRouter = s.router(contracts.userAccounts, {
  getUsersForTickets: async({ query }) => {
    try {
      const division = query.division;
      const section = query.section;
      const role = query.role;
      const mode = query.mode;
      const type = query.type;
      const requesteeId = query.requesteedId;

      const result = await fetchUsersForTicketForwarding( division, section, role, mode, requesteeId,type);
      return  {
        status: 201,
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
