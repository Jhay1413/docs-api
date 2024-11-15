import { Request, Response } from "express";
import { TicketingService } from "./ticketing.service-v1";
import { PrismaClient } from "@prisma/client";
import { ticketEditSchema, ticketingMutationSchema } from "shared-contract";
import { array, z } from "zod";
import { db } from "../../prisma";
import { GenerateId } from "../../utils/generate-id";
import { transferFile } from "../aws/aws.service";
import { io, userSockets } from "../..";

export class TicketingController {
  private ticketingService: TicketingService;

  constructor() {
    this.ticketingService = new TicketingService();
  }

  public async fetchPendingRequesteeTicketController(
    query: string,
    page: number,
    pageSize: number,
    priority?: string,
    state?: string,
    userId?: string,
    projectId?: string,
    transactionId?: string,
    senderId?: string,
    sortOrder?: string,
    status?: string,
  ) {
    try {
      const response = await this.ticketingService.fetchPendingRequesteeTicketService(
        query,
        page,
        pageSize,
        priority,
        state,
        projectId,
        userId,
        transactionId,
        senderId,
        sortOrder,
        status,
      );
      return response;
    } catch (error) {
      console.log(error);
      throw new Error("Error fetching pending requestee ticket");
    }
  }
  public async updateTicketOnInboxController(status: string, remarks: string, id: string) {
    try {
      await this.ticketingService.updateTicketOnInboxService(status, remarks, id);

      return;
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong updating ticket");
    }
  }
  public async createTicket(data: z.infer<typeof ticketingMutationSchema>) {
    try {
      const lastId = await this.ticketingService.getLastId();
      const generatedId = GenerateId(lastId, "ticket");
      const data_payload = { ...data, ticketId: generatedId };
      const response = await db.$transaction(async (tx) => {
        const result = await this.ticketingService.insertTicket(data_payload, tx);
        await this.ticketingService.logPostTicket(result, tx);
        return result;
      });
      if (!response.attachments || response.attachments.length === 0) return;
      await Promise.all(
        data.attachments.map(async (attachment) => {
          if (!attachment) {
            throw new Error("Attachment does not have a valid file URL");
          }
          try {
            const result = await transferFile(attachment);
            return result;
          } catch (error) {
            console.error(`Failed to transfer file ${attachment}:`, error);
            throw new Error(`Failed to transfer file: ${attachment}`);
          }
        }),
      );
      return;
    } catch (err: unknown) {
      console.log(err);
      throw new Error("Something went wrong.");
    }
  }

  public async fetchTicketsHandler(
    query: string,
    page: number,
    pageSize: number,
    priority?: string,
    state?: string,
    userId?: string,
    projectId?: string,
    transactionId?: string,
    senderId?: string,
    sortOrder?: string,
    status?: string,
  ) {
    try {
      const tickets = await this.ticketingService.fetchTicketsService(
        query,
        page,
        pageSize,
        priority,
        state,
        projectId,
        userId,
        transactionId,
        senderId,
        sortOrder,
        status,
      );
      const numOfTickets = await this.ticketingService.getNumOfTicketsService(query, state, userId);
      const numOfPages = numOfTickets ? Math.ceil(numOfTickets / pageSize) : 0;
      return {
        data: tickets,
        numOfTickets: numOfTickets || 0,
        totalPages: numOfPages || 0,
      };
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
      throw new Error("Failed to fetch tickets");
    }
  }

  public async getTicketsForUserByStatusHandler(userId: string, status: string, page: number, pageSize: number) {
    try {
      const tickets = await this.ticketingService.getTicketsForUserByStatusService(userId, status, page, pageSize);

      return tickets;
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
      throw new Error("Failed to fetch tickets");
    }
  }

  public async fetchTicketById(id: string) {
    try {
      const ticket = await this.ticketingService.fetchTicketByIdService(id);
      return ticket;
    } catch (error: unknown) {
      console.error("Failed to fetch ticket by ID:", error);
      throw new Error("Something went wrong");
    }
  }

  public async forwardTicketController(ticketId: string, data: z.infer<typeof ticketingMutationSchema>) {
    try {
      const old_attachments = await this.ticketingService.getTicketAttachments(ticketId);
      await db.$transaction(async (tx) => {
        const result = await this.ticketingService.updateTicket(ticketId, data, tx);
        await this.ticketingService.logPostTicket(result, tx);
        return result;
      });

      if (data.attachments.length === 0) return;

      const new_attachments = data.attachments.filter((item) => !old_attachments?.attachments.includes(item));
      await Promise.all(
        new_attachments.map(async (attachment) => {
          try {
            const result = await transferFile(attachment);
            return result;
          } catch (error) {
            console.error(`Failed to transfer file ${attachment}:`, error);
            throw new Error(`Failed to transfer file: ${attachment}`);
          }
        }),
      );
      const ticketInboxCount = await this.ticketingService.getIncomingTickets(data?.senderId);
      const receiverSocketId = userSockets.get(data.receiverId!);
      const ticketTracker = {
        incoming: ticketInboxCount.incomingTickets,
        inbox: ticketInboxCount.inboxTickets,
      };
      const message = false;
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("notification", message, ticketTracker);
      }
    } catch (err: unknown) {
      console.log(err);
      throw new Error("Something went wrong.");
    }
  }

  public async receiveTicketHandler(ticketId: string, dateReceived: string) {
    try {
      const response = await db.$transaction(async (tx) => {
        const result = await this.ticketingService.receiveTicketService(ticketId, dateReceived, tx);
        await this.ticketingService.receiveTicketLog(result.id, result.receiverId!, result.senderId, result.dateForwarded, dateReceived);

        return result
      });
      const ticketCounter = await this.ticketingService.getIncomingTickets(response.receiverId!);
      console.log(ticketCounter)
      const receiverSocketId = userSockets.get(response.receiverId!);
      if(receiverSocketId){

        io.to(receiverSocketId).emit("ticket-notification",ticketCounter);
      }
      return {
        message: "Ticket Received!",
      };
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong.");
    }
  }

  public async resolveTicketHandler(id: string, userId: string) {
    try {
      const response = await db.$transaction(async (tx) => {
        const result = await this.ticketingService.resolveTicketService(id, userId);
        await this.ticketingService.logPostTicket(result, tx);
        return {
          message: "Ticket resolved successfully",
        };
      });
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong");
    }
  }

  public async reopenTicketHandler(id: string, userId: string) {
    try {
      const response = await db.$transaction(async (tx) => {
        const result = await this.ticketingService.reopenTicketService(id, userId);
        await this.ticketingService.logPostTicket(result, tx);
        return {
          message: "Ticket reopened successfully",
        };
      });
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong");
    }
  }
}
