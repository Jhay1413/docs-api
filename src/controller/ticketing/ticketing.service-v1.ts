import { Prisma, PrismaClient } from "@prisma/client";
import * as z from "zod";
import { ticketingFormData } from "./ticketing.schema";
import { ticketEditSchema, ticketingMutationSchema, ticketLogsSchema, transactionMutationSchema } from "shared-contract";
import { db } from "../../prisma";


export class TicketingService {
  private db: PrismaClient;
  constructor(db: PrismaClient) {
    this.db = db;
  }

  public async insertTicket(data: z.infer<typeof ticketingMutationSchema>, tx:Prisma.TransactionClient) {

    try {
     const response = await tx.ticket.create({
        data: data,
        select : {
          id: true,
          ticketId: true,
          status: true,
          priority: true,
          remarks: true,
          dateForwarded: true,
          dateReceived: true,
          sender: {
            select: {
              userInfo: {
                select: {
                  firstName: true,
                  lastName: true,
                }
              }
            }
          },
          receiver: {
            select: {
              userInfo: {
                select: {
                  firstName: true,
                  lastName: true,
                }
              }
            }
          },
          createdAt: true,
          updatedAt: true,
          attachments: true,
        }
      });

      const logs = {
        ...response, 
        ticketId:response.id,
        sender: `${response.sender.userInfo?.firstName} ${response.sender.userInfo?.lastName}`,
        receiver: `${response.receiver.userInfo?.firstName} ${response.receiver.userInfo?.lastName}`,
        dateForwarded: response.dateForwarded.toISOString(),
        dateReceived: response.dateReceived?.toISOString() || null,
        createdAt: response.createdAt.toISOString(),
        updatedAt: response.updatedAt.toISOString(),
      }
      return logs;
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong");
    }
  }

  public async logPostTicket(data: z.infer<typeof ticketLogsSchema>, tx: Prisma.TransactionClient) {
    console.log(data);
    try {
      const logEntry = await tx.ticketLogs.create({
        data: {
          ticketId: data.ticketId,
          status: data.status,
          priority: data.priority,
          remarks: data.remarks || null,
          dateForwarded: new Date(data.dateForwarded),
          dateReceived: data.dateReceived ? new Date(data.dateReceived) : null,
          sender: data.sender,
          receiver: data.receiver,
          attachments: data.attachments || null,
        },
      });
      console.log(`Log entry created successfully for ticket ID: ${data.ticketId}`);
      return logEntry;
  
    } catch (error) {
      console.error("Error creating log entry:", error);
      throw new Error("Failed to log ticket update.");
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
          sender:{firstName:ticket.sender.userInfo!.firstName, lastName: ticket.sender.userInfo!.lastName},
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
  
      const formattedTicketLogs = ticket.ticketLogs.map(log => {
        return {...log, 
          dateForwarded:log.dateForwarded.toISOString(),
          dateReceived: log.dateReceived?.toISOString() || null,
          createdAt: log.createdAt.toISOString(),
          updatedAt: log.updatedAt.toISOString(),

        }
      });
  
      const formattedTicket = {
        ...ticket,
        dueDate: ticket.dueDate.toISOString(),
        dateForwarded: ticket.dateForwarded.toISOString(),
        dateReceived: ticket.dateReceived ? ticket.dateReceived.toISOString() : null,
        ticketLogs: formattedTicketLogs,
      };
  
      return formattedTicket;
    } catch (error) {
      console.error("Failed to fetch ticket:", error);
      throw new Error("Something went wrong");
    }
  }
  
  
  public async updateTicket(id: string, data: z.infer<typeof ticketEditSchema>, tx:Prisma.TransactionClient) {
    try {
      const result = await tx.ticket.update({
        where: { id: id },
        data:data,
        select : {
          id: true,
          ticketId: true,
          status: true,
          priority: true,
          remarks: true,
          dateForwarded: true,
          dateReceived: true,
          sender: {
            select: {
              userInfo: {
                select: {
                  firstName: true,
                  lastName: true,
                }
              }
            }
          },
          receiver: {
            select: {
              userInfo: {
                select: {
                  firstName: true,
                  lastName: true,
                }
              }
            }
          },
          createdAt: true,
          updatedAt: true,
          attachments: true,
        }
      });
      const logs = {
        ...result, 
        ticketId:result.id,
        sender: `${result.sender.userInfo?.firstName} ${result.sender.userInfo?.lastName}`,
        receiver: `${result.receiver.userInfo?.firstName} ${result.receiver.userInfo?.lastName}`,
        dateForwarded: result.dateForwarded.toISOString(),
        dateReceived: result.dateReceived?.toISOString() || null,
        createdAt: result.createdAt.toISOString(),
        updatedAt: result.updatedAt.toISOString(),
      }

      return logs;
    } catch (error) {
      console.error("Failed to update ticket:", error);
      throw new Error("Failed to update ticket");
    }
  }
}
