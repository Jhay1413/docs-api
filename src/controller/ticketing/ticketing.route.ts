import { Router } from "express";
import { TicketingController } from "./ticketing.controller-v1";

const router = Router();
const ticketingController = new TicketingController();

// router.get('/tickets/:userId', async (req, res) => {
//     const { status } = req.query;
//     const userId = req.params.userId;
//     console.log(userId);
//     const page = parseInt(req.query.page as string, 10) || 1;
//     const pageSize = parseInt(req.query.pageSize as string, 10) || 10;

//     try {
//       const tickets = await ticketingController.getTicketsForUserByStatusHandler(userId, "incoming", page, pageSize);
//       res.status(200).json({tickets});
//     } catch (error) {
//       res.status(500).json({ message: error });
//     }
//   });
// route for creating a new ticket
// router.post('/tickets/create', (req, res) => ticketingController.createTicket(req, res));
// router.get('/tickets', (req, res) => ticketingController.fetchTickets(req, res));
// router.get('/tickets/:ticketId', ticketingController.fetchTicketById.bind(ticketingController));
// router.put('/tickets/edit/:ticketId', (req, res) => ticketingController.updateTicket(req, res));

export default router;
