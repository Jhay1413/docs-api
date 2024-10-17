import { Router } from 'express';
import { TicketingController } from './ticketing.controller-v1';

const router = Router();
const ticketingController = new TicketingController();

// route for fetching a ticket by ID
router.get('/tickets/:ticketId', (req, res) => ticketingController.getTicket(req, res));

// route for fetching all tickets
router.get('/tickets', (req, res) => ticketingController.getAllTickets(req, res));

// route for fetching tickets by priority
router.get('/tickets/priority/:priority', ticketingController.getTicketsByPriority.bind(ticketingController));

// route for fetching tickets by section
router.get('/tickets/section/:section', ticketingController.getTicketsBySection.bind(ticketingController));

// route for creating a new ticket
router.post('/create/tickets', (req, res) => ticketingController.createTicket(req, res));

export default router;
