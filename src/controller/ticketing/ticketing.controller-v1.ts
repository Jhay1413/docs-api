import { Request, Response } from 'express';
import { TicketingService } from './ticketing.service-v1';

export class TicketingController {
  private ticketingService: TicketingService;

  constructor() {
    this.ticketingService = new TicketingService();
  }

  // Handle GET request for a ticket by ID
  async getTicket(req: Request, res: Response): Promise<void> {
    try {
      const { ticketId } = req.params;
      const ticket = await this.ticketingService.getTicketByIdService(ticketId);
      if (!ticket) {
        res.status(404).json({ message: 'Ticket not found' });
      }
      res.status(200).json(ticket);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching ticket', error });
    }
  }

  async getAllTickets(req: Request, res: Response) {
    const tickets = await this.ticketingService.getAllTicketsService();
    res.json(tickets);
  }

  async getTicketsByPriority(req: Request, res: Response) {
    const { priority } = req.params;
    try {
      const tickets = await this.ticketingService.getTicketsByPriorityService(priority);
      res.status(200).json(tickets);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tickets by priority' });
    }
  }

  async getTicketsBySection(req: Request, res: Response) {
    const { section } = req.params;
    try {
      const tickets = await this.ticketingService.getTicketsBySectionService(section);
      res.status(200).json(tickets);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tickets by section' });
    }
  }

  // Handle POST request to create a new ticket
  async createTicket(req: Request, res: Response): Promise<void> {
    try {
      const ticketData = req.body;
      const newTicket = await this.ticketingService.createTicketService(ticketData);
      res.status(201).json(newTicket);
    } catch (error) {
      res.status(500).json({ message: 'Error creating ticket', error });
    }
  }
}
