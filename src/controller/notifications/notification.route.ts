import { createExpressEndpoints } from "@ts-rest/express";
import { contracts } from "shared-contract";

import s from "../../utils/ts-rest-server";
import { NotificationController } from "./notification.controller";

const notificationController = new NotificationController();

const notificationRouter = s.router(contracts.notificationContract, {
  readNotif: async ({ params, body }) => {
    try {
      await notificationController.readNotificationController(params.id, body.dateRead);
      return {
        status: 200,
        body: {
          message: "notification updated successfully ",
        },
      };
    } catch (error) {
      return {
        status: 500,
        body: {
          error: "Failed to update ticket.",
        },
      };
    }
  },
  getNotificationsByUserId: async ({ query }) => {
    try {
      const result = await notificationController.getNotificationsByUserController(query.id);
      return {
        status: 200,
        body: result,
      };
    } catch (error) {
      return {
        status: 500,
        body: {
          error: "Failed to update ticket.",
        },
      };
    }
  },
});

export const registerNotificationRoutes = (app: any) => {
  createExpressEndpoints(contracts.notificationContract, notificationRouter, app);
};
