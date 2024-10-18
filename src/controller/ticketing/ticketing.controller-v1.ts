import { Request, Response } from 'express';
import { TicketingService } from './ticketing.service-v1';
import { ticketingFormData } from './ticketing.schema';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TicketingController {
  private ticketingService: TicketingService;

  constructor() {
    this.ticketingService = new TicketingService();
  }

  public async createTicket(req: any, res: any): Promise<void> {
    const validation = ticketingFormData.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: validation.error.errors,
      });
      return;
    }

    const ticketData = validation.data;

    try {
      const result = await prisma.$transaction(async (tx) => {
        const createdTicket = await this.ticketingService.insertTicket(ticketData, tx);
        return createdTicket;
      });
      res.status(201).json(result);
    } catch (err: unknown) { 
      if (err instanceof Error) {
        res.status(500).json({ error: 'Failed to create ticket', details: err.message });
      } else {
        res.status(500).json({ error: 'Failed to create ticket due to unknown error' });
      }
    }
  }
}
