import { Request, Response } from 'express';
import { TicketingService } from './ticketing.service-v1';
import { ticketingFormData } from './ticketing.schema';
import { PrismaClient } from '@prisma/client';
import { ticketEditSchema, ticketingMutationSchema } from 'shared-contract';
import {z} from 'zod'
const prisma = new PrismaClient();

export class TicketingController {
  private ticketingService: TicketingService;

  constructor() {
    this.ticketingService = new TicketingService(prisma);
  }

  public async createTicket(data: z.infer<typeof ticketingMutationSchema>) {
    try {
      const result = await this.ticketingService.insertTicket(data);
      return result;

    } catch (err: unknown) {
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

  public async fetchTicketById(req: Request, res: Response){
    const { ticketId } = req.params;

    try {
      const ticket = await this.ticketingService.fetchTicketByIdService(ticketId);
      res.status(200).json(ticket);
    } catch (error: unknown) {
      console.error("Failed to fetch ticket by ID:", error);

      if (error instanceof Error) {
        res.status(500).json({ error: "Failed to fetch ticket", details: error.message });
      } else {
        res.status(500).json({ error: "Failed to fetch ticket due to unknown error" });
      }
    }
  }

  public async updateTicket(ticketId: string, data: z.infer<typeof ticketEditSchema>) {
    try {
      const result = await this.ticketingService.updateTicket(ticketId, data);
      return result;
    } catch (err: unknown) {
        throw new Error('Failed to update ticket due to unknown error');
    }
  }
}
