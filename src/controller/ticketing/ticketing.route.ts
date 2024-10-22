import { Router } from 'express';
import { TicketingController } from './ticketing.controller-v1';

const router = Router();
const ticketingController = new TicketingController();

// route for creating a new ticket
// router.post('/tickets/create', (req, res) => ticketingController.createTicket(req, res));
// router.get('/tickets', (req, res) => ticketingController.fetchTickets(req, res));
// router.get('/tickets/:ticketId', ticketingController.fetchTicketById.bind(ticketingController));
// router.put('/tickets/edit/:ticketId', (req, res) => ticketingController.updateTicket(req, res));

export default router;