import { createExpressEndpoints } from "@ts-rest/express";
import { contracts } from "shared-contract";

import { TicketingController } from "./ticketing.controller-v1";
import s from "../../utils/ts-rest-server";

const ticketingController = new TicketingController();

const ticketingRouter = s.router(contracts.ticketing, {
  getTickets: async ({ query }) => {
    try {
      const page = parseInt(query.page, 10);
      const pageSize = parseInt(query.pageSize, 10);
      const result = await ticketingController.fetchTickets(query.query, page, pageSize);
      return {
        status: 200,
        body: result,
      };
    } catch (error) {
      return {
        status: 500,
        body: {
          error: "Something went wrong while fetching tickets.",
        },
      };
    }
  },
  getTicketsById: async ({ params }) => {
    try {
      const result = await ticketingController.fetchTicketById(params.id);
      return {
        status: 200,
        body: result,
      };
    } catch (err) {
      return {
        status: 500,
        body: {
          error: "Failed to update ticket.",
        },
      };
    }
  },
  getTicketsForUserByStatus: async ({ params, query }) => {
    try {
      const userId = params.id;
      const page = parseInt(query.page, 10);
      const pageSize = parseInt(query.pageSize, 10);
      const tickets = await ticketingController.getTicketsForUserByStatusHandler(
        userId,
        query.status,
        page,
        pageSize
      );

      return {
        status: 200,
        body: tickets,
      };
    } catch (error) {
      return {
        status: 500,
        body: {
          error: "Something went wrong while fetching tickets.",
        },
      };
    }
  },
  createTickets: async ({ body }) => {
    try {
      await ticketingController.createTicket(body);
      return {
        status: 200,
        body: {
          message: "Ticket created successfully",
        },
      };
    } catch (error) {
      return {
        status: 500,
        body: {
          error: "Failed to create ticket.",
        },
      };
    }
  },

  editTickets: async ({ params, body }) => {
    try {
      await ticketingController.updateTicket(params.id, body);
      return {
        status: 200,
        body: {
          message: "Ticket updated successfully",
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
  forwardTickets: async ({ params, body }) => {
    try {
      await ticketingController.updateTicket(params.id, body);
      return {
        status: 200,
        body: {
          message: "Ticket updated successfully",
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
});

export const registerTicketingRoutes = (app: any) => {
  createExpressEndpoints(contracts.ticketing, ticketingRouter, app);
};
