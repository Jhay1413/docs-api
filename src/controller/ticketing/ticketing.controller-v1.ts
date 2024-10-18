import { Request, Response } from 'express';
import { TicketingService } from './ticketing.service-v1';
import { ticketingFormData } from './ticketing.schema';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TicketingController {
  private ticketingService: TicketingService;

  constructor() {
    this.ticketingService = new TicketingService(prisma);
  }

  public async createTicket(req: Request, res: Response): Promise<void> {
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
      const result = await this.ticketingService.insertTicket(ticketData);
      
      if (result.ticket) {
        res.status(200).json(result);
      } else {
        res.status(500).json({ error: 'Failed to create ticket', details: result.details });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).json({ error: 'Failed to create ticket', details: err.message });
      } else {
        res.status(500).json({ error: 'Failed to create ticket due to unknown error' });
      }
    }
  }
  public async fetchTickets(req: Request, res: Response): Promise<void> {
    const query = (req.query.query as string) || ''; // Typecasting req.query.query to string
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const status = req.query.status as string | undefined; // If status is optional

    try {
      const tickets = await this.ticketingService.fetchTickets(query, page, pageSize, status);
      res.status(200).json(tickets);
    } catch (error) {
      console.error("Failed to fetch tickets:", error);

      if (error instanceof Error) {
        res.status(500).json({ error: 'Failed to fetch tickets', details: error.message });
      } else {
        res.status(500).json({ error: 'Failed to fetch tickets due to unknown error' });
      }
    }
  }

  public async updateTicket(req: Request, res: Response): Promise<void> {
    const { ticketId } = req.params;
    const updateData = req.body;

    try {
      const result = await this.ticketingService.updateTicket(ticketId, updateData);
      res.status(200).json(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).json({ error: 'Failed to update ticket', details: err.message });
      } else {
        res.status(500).json({ error: 'Failed to update ticket due to unknown error' });
      }
    }
  }
}
