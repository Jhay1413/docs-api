import { createExpressEndpoints } from "@ts-rest/express";
import { contracts } from "shared-contract";

import { TicketingController } from "./ticketing.controller-v1";
import s from "../../utils/ts-rest-server";

const ticketingController = new TicketingController();

const ticketingRouter = s.router(contracts.ticketing, {
  fetchPendingRequesteeTicketRoutes: async ({ query }) => {
    try {
      const page = parseInt(query.page, 10);
      const pageSize = parseInt(query.pageSize, 10);
      const response = await ticketingController.fetchPendingRequesteeTicketController(query.query, page, pageSize, query.status, query.userId);
      return {
        status: 201,
        body: response,
      };
    } catch (error) {}
  },
  updateTicketOnInboxRoutes: async ({ params, body }) => {
    try {
      await ticketingController.updateTicketOnInboxController(body.status, body.remarks, params.id);
      return {
        status: 201,
        body: {
          message: "Ticket updated successfully !",
        },
      };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        body: {
          error: "Something went wrong while updating tickets.",
        },
      };
    }
  },
  getTickets: async ({ query }) => {
    try {
      const page = parseInt(query.page, 10);
      const pageSize = parseInt(query.pageSize, 10);
      const result = await ticketingController.fetchTickets(query.query, page, pageSize, query.status, query.userId);
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
      await ticketingController.forwardTicketController(params.id, body);
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
  receiveTickets: async ({ params, body }) => {
    try {
      const response = await ticketingController.receiveTicketHandler(params.id, body.dateReceived);
      return {
        status: 201,
        body: {
          message: response.message,
        },
      };
    } catch (error) {
      return {
        status: 500,
        body: {
          error: "Failed to receive ticket.",
        },
      };
    }
  },
  forwardTickets: async ({ params, body }) => {
    try {
      await ticketingController.forwardTicketController(params.id, body);
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
  resolveTickets: async ({ params, body }) => {
    try {
      await ticketingController.resolveTicketHandler(params.id, body.userId);
      return {
        status: 200,
        body: {
          message: "Ticket resolved",
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
  reopenTickets: async ({ params, body }) => {
    try {
      await ticketingController.reopenTicketHandler(params.id, body.requestee);
      return {
        status: 200,
        body: {
          message: "Ticket reopened",
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
