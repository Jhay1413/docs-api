import { Router } from 'express';
import { TicketingController } from './ticketing.controller-v1';

const router = Router();
const ticketingController = new TicketingController();

// route for creating a new ticket
router.post('/create/tickets', (req, res) => ticketingController.createTicket(req, res));

export default router;
