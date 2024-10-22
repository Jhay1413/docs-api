import { PrismaClient } from "@prisma/client";
import * as z from "zod";
import { ticketingFormData } from "./ticketing.schema";
import { ticketEditSchema, ticketingMutationSchema } from "shared-contract";


export class TicketingService {
  private db: PrismaClient;
  constructor(db: PrismaClient) {
    this.db = db;
  }

  public async insertTicket(data: z.infer<typeof ticketingMutationSchema>) {

    try {
     await this.db.ticket.create({
        data: data,
      });
    } catch (error) {
      throw new Error("Something went wrong");
    }
  }

  public async fetchTickets(query: string, page: number, pageSize: number, status?: string, userId?: string) {
    console.log(pageSize);
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
        include: {
          receiver: {
            include: {
              userInfo: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          sender: {
            include: {
              userInfo: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          project: true,
          transaction: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const formattedTickets = tickets.map((ticket) => {
        return {
          ...ticket,
          receiver:{firstName:ticket.receiver.userInfo!.firstName, lastName: ticket.receiver.userInfo!.lastName},
          sender:{firstName:ticket.receiver.userInfo!.firstName, lastName: ticket.receiver.userInfo!.lastName},
          dueDate: ticket.dueDate.toISOString(),
          createdAt: ticket.createdAt.toISOString(),
          updatedAt: ticket.updatedAt.toISOString(),
        };
      });

      return formattedTickets;
    } catch (error) {
      console.log("Something went wrong while fetching tickets.", error);
      throw new Error("Something went wrong while searching");
    }
  }

  public async fetchTicketByIdService(ticketId: string) {
    try {
      const ticket = await this.db.ticket.findUnique({
        where: { id: ticketId },
        include: {
          receiver: {
            include: {
              userInfo: true,
            },
          },
          sender: {
            include: {
              userInfo: true,
            },
          },
          requestee: {
            include: {
              userInfo: true,
            },
          },
          project: true,
          transaction: true,
          ticketLogs: true,
        },

      });

      if (!ticket) {
        throw new Error("Ticket not found");
      }

      const formattedTicket = {
        ...ticket,
        dueDate: ticket.dueDate.toISOString(),
        dateForwarded: ticket.dateForwarded.toISOString(),
        dateReceived: ticket.dateReceived ? ticket.dateReceived.toISOString() : null,
        remarks: ticket.remarks ? ticket.remarks : null,
      };

      return formattedTicket;
    } catch (error) {
      console.error("Failed to fetch ticket:", error);
      throw new Error("Failed to fetch ticket");
    }
  }
  
  public async updateTicket(ticketId: string, data: z.infer<typeof ticketEditSchema>) {
    try {
       await this.db.ticket.update({
        where: { id: ticketId },
        data:data,
      });
    } catch (error) {
      console.error("Failed to update ticket:", error);
      throw new Error("Failed to update ticket");
    }
  }
}
