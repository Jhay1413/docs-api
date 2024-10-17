import { z } from "zod";
import { ticketingFormData, ticketingLogsData } from "./ticketing.schema";

type Ticket = z.infer<typeof ticketingFormData>;

export class TicketingService {
  // Temporarily assign tickets to array of object 'Ticket'
  public tickets: Ticket[] = [];
  public ticketIdCounter: number;

  constructor() {
    // Initialize ticket ID counter
    this.ticketIdCounter = 1; // Start from 1

    // Hard-coded JSON data for testing of API
    this.tickets = [
      {
        id: this.ticketIdCounter.toString(),
        ticketId: "123",
        subject: "Incident Report Number 1",
        section: "IT",
        status: "ON-PROCESS",
        remarks: "Test ticket details",
        priority: "Critical",
        dueDate: "2024-10-10T10:00:00Z",
        createdAt: new Date().toISOString(), // Current timestamp
        updatedAt: new Date().toISOString(), // Current timestamp
        attachments: "https://dts.com/attachments/ticket123.pdf",
        transactionId: "tx001",
        projectId: "project001",
        senderId: "user001",
        receiverId: "user002",
        assigneeId: "user003",
        requesteeId: "user004"
      },
      {
        id: (this.ticketIdCounter + 1).toString(),
        ticketId: "124",
        subject: "Processing New Assets",
        section: "EDP",
        status: "APPROVED",
        remarks: "The new devices needs to be logged into the Asset Inventory",
        priority: "High",
        dueDate: "2024-10-15T10:00:00Z",
        createdAt: new Date().toISOString(), // Current timestamp
        updatedAt: new Date().toISOString(), // Current timestamp
        attachments: "https://dts.com/attachments/ticket124.png",
        transactionId: "tx002",
        projectId: "project002",
        senderId: "user005",
        receiverId: "user006",
        assigneeId: "user007",
        requesteeId: "user008"
      }
    ];

    // increment to accomodate the Hard-coded dummy data
    this.ticketIdCounter = this.tickets.length + 1;
  }

  // Fetch a ticket by ID
  public async getTicketByIdService(ticketId: string): Promise<Ticket | undefined> {
    return this.tickets.find(ticket => ticket.ticketId === ticketId);
  }

  public async getAllTicketsService(): Promise<Ticket[]> {
    return this.tickets;
  }
  public async getTicketsByPriorityService(priority: string): Promise<Ticket[]> {
    return this.tickets.filter(ticket => ticket.priority === priority);
  }
  public async getTicketsBySectionService(section: string): Promise<Ticket[]> {
    return this.tickets.filter(ticket => ticket.section === section);
  }

  public async createTicketService(ticketData: Ticket): Promise<Ticket> {
    ticketData.id = this.ticketIdCounter.toString();
    ticketData.createdAt = new Date().toISOString(); // Set to current time
    ticketData.updatedAt = new Date().toISOString(); // Set to current time
    this.tickets.push(ticketData);
    this.ticketIdCounter++;
    return ticketData;
  }

  // public async logPostTicketing(data: z.infer<typeof ticketingLogsData>, ){

  // }
}