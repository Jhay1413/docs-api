import { Request, Response } from "express";
import { TicketingService } from "./ticketing.service-v1";
import { PrismaClient } from "@prisma/client";
import { ticketEditSchema, ticketingMutationSchema,  } from "shared-contract";
import { z } from "zod";
import { db } from "../../prisma";
import { GenerateId } from "../../utils/generate-id";

const prisma = new PrismaClient();

export class TicketingController {
  private ticketingService: TicketingService;

  constructor() {
    this.ticketingService = new TicketingService(prisma);
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
      })} catch (err: unknown) {
      console.log(err);
      throw new Error("Something went wrong.");
    }
  }

  public async fetchTickets(status: string, page: number, pageSize: number) {
    try {
      const tickets = await this.ticketingService.fetchTickets(status, page, pageSize);
      return tickets;
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

  public async updateTicket(ticketId: string, data: z.infer<typeof ticketingMutationSchema>) {
    try {
      await db.$transaction(async (tx) => {
        const result = await this.ticketingService.updateTicket(ticketId, data, tx);
        await this.ticketingService.logPostTicket(result, tx);
        return result;
      })} catch (err: unknown) {
      console.log(err);
      throw new Error("Something went wrong.");
    }
  }

  public async receiveTicketHandler(ticketId: string,  dateReceived: string) {

    try {
      const response = await db.$transaction(async (tx) => {
        const result = await this.ticketingService.receiveTicketService(ticketId, dateReceived, tx);
        await this.ticketingService.receiveTicketLog(result.id, result.receiverId!, result.senderId, result.dateForwarded, dateReceived)});
        return {
          message: "Ticket Received!"
        }
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong.");
    }
  }

  public async updateTicketHandler( id: string, data: z.infer<typeof ticketEditSchema>) {
    try {
      await db.$transaction(async (tx) => {
        const result = await this.ticketingService.updateTicket(id, data, tx);
        await this.ticketingService.logPostTicket(result, tx)
      });
  
      return { 
        message: "Ticket updated successfully" 
      };
    } catch (error) {
      console.error("Error in updateTicketHandler:", error);
      throw new Error("Something went wrong while updating the ticket");
    }
  }

  public async resolveTicketHandler(id: string, userId: string) {
    try {
      const response = await db.$transaction(async (tx) => {
        const result = await this.ticketingService.resolveTicketService(id, userId);
        await this.ticketingService.logPostTicket(result, tx);
        return { 
          message: "Ticket resolved successfully" 
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
          message: "Ticket reopened successfully" 
        }; 
      });
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong");
    }
  }
}
