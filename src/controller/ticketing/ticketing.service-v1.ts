import { PrismaClient } from "@prisma/client";
import * as z from "zod";
import { ticketingFormData } from "./ticketing.schema";

type Ticket = z.infer<typeof ticketingFormData>;

export class TicketingService {
  private db: PrismaClient;
  constructor(db: PrismaClient) {
    this.db = db;
  }

  public async insertTicket(data: Ticket) {
    const { receiverId, status, attachments } = data;
    let modifiedTicket;
    try {
      const createdTicket = await this.db.ticket.create({
        data: data,
        include: {
          project: true,
          transaction: true,
        },
      });
      modifiedTicket = {
        ...createdTicket,
        dueDate: createdTicket.dueDate.toISOString(),
      };
      const response = {
        message: "Ticket created successfully",
        ticket: modifiedTicket,
      };
      console.log(response);
      // Throw an error to trigger rollback for testing
      throw new Error("Rollback for test");
    } catch (error) {
      console.error("Rollback triggered:", error);
      return {
        message: "Test completed, changes were not committed.",
        details: error instanceof Error ? error.message : "Unknown error",
        ticket: error instanceof Error && error.message === "Rollback for test" ? modifiedTicket : undefined,
      };
    }
  }

  public async fetchTickets(query: string, page: number, pageSize: number, status?: string, userId?: string) {
    const skip = (page - 1) * pageSize;
    let condition: any = {};

    if (status) {
      if (status === "ARCHIVED") {
        condition = {
          status: {
            equals: status,
          },
        };
      } else {
        condition = {
          status: {
            not: "ARCHIVED",
          },
        };
      }
    }

    try {
      const tickets = await this.db.ticket.findMany({
        skip,
        take: pageSize,
        where: {
          AND: [
            condition,
            {
              OR: [
                { subject: { contains: query, mode: "insensitive" } },
                { section: { contains: query, mode: "insensitive" } },
                { status: { contains: query, mode: "insensitive" } },
                { priority: { contains: query, mode: "insensitive" } },
                { requestDetails: { contains: query, mode: "insensitive" } },
                { ticketId: { contains: query, mode: "insensitive" } },
              ],
            },
          ],
        },
        select: {
          id: true,
          ticketId: true,
          subject: true,
          section: true,
          status: true,
          priority: true,
          dueDate: true,
          receiver: {
            select: {
              userInfo: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          sender: {
            select: {
              userInfo: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const formattedTickets = tickets.map((ticket) => {
        const receiver = ticket.receiver?.userInfo ? `${ticket.receiver.userInfo.firstName} - ${ticket.receiver.userInfo.lastName}` : null;
        const sender = ticket.sender?.userInfo ? `${ticket.sender.userInfo.firstName} - ${ticket.sender.userInfo.lastName}` : null;
        return {
          ...ticket,
          dueDate: ticket.dueDate.toISOString(),
          receiver: receiver,
          sender: sender,
        };
      });

      return formattedTickets;
    } catch (error) {
      console.log("Something went wrong while fetching tickets.", error);
      throw new Error("Something went wrong while searching");
    }
  }

  public async updateTicket(ticketId: string, data: Partial<Pick<Ticket, 'senderId' | 'receiverId' | 'remarks' | 'priority' | 'status'>>) {
    try {
      const updatedTicket = await this.db.ticket.update({
        where: { ticketId },
        data: {
          senderId: data.senderId,
          receiverId: data.receiverId,
          remarks: data.remarks,
          priority: data.priority,
          status: data.status,
        },
        include: {
          project: true,
          transaction: true,
        },
      });

      return {
        message: "Ticket updated successfully",
        ticket: updatedTicket,
      };
    } catch (error) {
      console.error("Failed to update ticket:", error);
      throw new Error("Failed to update ticket");
    }
  }
}
