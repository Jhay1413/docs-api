import { Router } from 'express';
import { TicketingController } from './ticketing.controller-v1';

const router = Router();
const ticketingController = new TicketingController();

// route for creating a new ticket
router.post('/create/tickets', (req, res) => ticketingController.createTicket(req, res));
router.get('/tickets/list', (req, res) => ticketingController.fetchTickets(req, res));
router.put('/tickets/edit/:ticketId', (req, res) => ticketingController.updateTicket(req, res));

export default router;
