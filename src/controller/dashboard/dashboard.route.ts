import { contracts } from "shared-contract";
import s from "../../utils/ts-rest-server";
import { DashboardController } from "./dashboard.controller";
import { createExpressEndpoints } from "@ts-rest/express";
const dashboardController = new DashboardController();
const dashboardRouter = s.router(contracts.dashboardContract, {
  getDashboardData: async () => {
    try {
      const result = await dashboardController.getDashboardData();
      return {
        status: 200,
        body: result,
      };
    } catch (error) {
      return {
        status: 500,
        body: {
          error: "Something went wrong ",
        },
      };
    }
  },
});
export const dsahboardRoutes = (app: any) => {
  createExpressEndpoints(contracts.dashboardContract, dashboardRouter, app);
};
