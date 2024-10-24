import { Request, Response } from "express";
import { TicketingService } from "./ticketing.service-v1";
import { PrismaClient } from "@prisma/client";
import { ticketEditSchema, ticketingMutationSchema } from "shared-contract";
import { z } from "zod";
import { db } from "../../prisma";
const prisma = new PrismaClient();

export class TicketingController {
  private ticketingService: TicketingService;

  constructor() {
    this.ticketingService = new TicketingService(prisma);
  }

  public async createTicket(data: z.infer<typeof ticketingMutationSchema>) {
    try {
      const response = await db.$transaction(async (tx) => {
        const result = await this.ticketingService.insertTicket(data, tx);
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
      return tickets; // Return tickets
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

  public async updateTicket(ticketId: string, data: z.infer<typeof ticketEditSchema>) {
    try {
      const response = await db.$transaction(async (tx) => {
        const result = await this.ticketingService.updateTicket(ticketId, data, tx);
        await this.ticketingService.logPostTicket(result, tx);
        return result;
      })} catch (err: unknown) {
      console.log(err);
      throw new Error("Something went wrong.");
    }
  }
}
