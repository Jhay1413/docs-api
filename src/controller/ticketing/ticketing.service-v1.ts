import { Prisma, PrismaClient } from "@prisma/client";
import * as z from "zod";
import { ticketingFormData } from "./ticketing.schema";
import { ticketEditSchema, ticketingMutationSchema, ticketLogsSchema, transactionMutationSchema } from "shared-contract";
import { db } from "../../prisma";
import { StatusCheckerForQueries } from "../../utils/utils";

export class TicketingService {
  private db: PrismaClient;
  constructor(db: PrismaClient) {
    this.db = db;
  }

  public async insertTicket(data: z.infer<typeof ticketingMutationSchema>, tx: Prisma.TransactionClient) {
    try {
      const response = await tx.ticket.create({
        data: data,
        include: {
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
        },
      });

      const logs = {
        ...response,
        ticketId: response.id,
        sender: `${response.sender.userInfo?.firstName} ${response.sender.userInfo?.lastName}`,
        receiver: `${response.receiver?.userInfo?.firstName} ${response.receiver?.userInfo?.lastName}`,
        senderId: response.senderId,
        receiverId: response.receiverId,
        dateForwarded: response.dateForwarded.toISOString(),
        dateReceived: response.dateReceived?.toISOString() || null,
        createdAt: response.createdAt.toISOString(),
        updatedAt: response.updatedAt.toISOString(),
        attachments: response.attachments,
      };

      return logs;
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong");
    }
  }
  public async receiveTicketLog(ticketId: string, receiverId: string, senderId: string, dateForwarded: string, datReceived: string) {
    try {
      const response = await db.ticketLogs.update({
        where: {
          refId: {
            ticketId: ticketId,
            receiverId: receiverId,
            senderId: senderId,
            dateForwarded: dateForwarded,
          },
        },
        data: {
          dateReceived: datReceived,
        },
      });
      return response;
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong!");
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
          senderId: data.senderId,
          receiverId: data.receiverId,
          attachments: data.attachments,
        },
      });
      return logEntry;
    } catch (error) {
      console.error("Error creating log entry:", error);
      throw new Error("Failed to log ticket update.");
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
      const tickets = await db.ticket.findMany({
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
          receiver: ticket.receiver ? { firstName: ticket.receiver?.userInfo!.firstName, lastName: ticket.receiver?.userInfo!.lastName } : null,
          sender: { firstName: ticket.sender.userInfo!.firstName, lastName: ticket.sender.userInfo!.lastName },
          dueDate: ticket.dueDate.toISOString(),
          createdAt: ticket.createdAt.toISOString(),
          updatedAt: ticket.updatedAt.toISOString(),
          dateForwarded: ticket.dateForwarded.toISOString(),
          dateReceived: ticket.dateReceived?.toISOString() || null,
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
      const ticket = await db.ticket.findUnique({
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
          transaction: {
            select: {
              transactionId: true,
              documentSubType: true,
              status: true,
              priority: true,
              dueDate: true,
            }
          },
          ticketLogs: true,
        },
      });

      if (!ticket) {
        throw new Error("Ticket not found");
      }

      const formattedTicketLogs = ticket.ticketLogs.map((log) => {
        return {
          ...log,
          receiver : log.receiver,
          dateForwarded: log.dateForwarded.toISOString(),
          dateReceived: log.dateReceived?.toISOString() || null,
          createdAt: log.createdAt.toISOString(),
          updatedAt: log.updatedAt.toISOString(),
        };
      });

      const formattedTicket = {
      ...ticket,
        dueDate: ticket.dueDate.toISOString(),
        dateForwarded: ticket.dateForwarded.toISOString(),
        dateReceived: ticket.dateReceived?.toISOString() || null,
        transaction: ticket.transaction
          ? {
              transactionId: ticket.transaction.transactionId,
              documentSubType: ticket.transaction.documentSubType,
              status: ticket.transaction.status,
              priority: ticket.transaction.priority,
              dueDate: ticket.transaction.dueDate.toISOString(),
            }
          : null,
        ticketLogs: formattedTicketLogs
      };

      return formattedTicket;
    } catch (error) {
      console.error("Failed to fetch ticket:", error);
      throw new Error("Something went wrong");
    }
  }

  public async getTicketsForUserByStatusService(userId: string, status: string, page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    const whereCondition = StatusCheckerForQueries(userId, status);
    try {
      const tickets = await db.ticket.findMany({
        skip,
        take: pageSize,
        where: whereCondition,
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
          receiverId: ticket.receiverId || null,
          receiver: ticket.receiver
            ? {
                firstName: ticket.receiver.userInfo!.firstName,
                lastName: ticket.receiver.userInfo!.lastName,
              }
            : null,
          sender: {
            firstName: ticket.sender.userInfo!.firstName,
            lastName: ticket.sender.userInfo!.lastName,
          },
          dueDate: ticket.dueDate.toISOString(),
          createdAt: ticket.createdAt.toISOString(),
          updatedAt: ticket.updatedAt.toISOString(),
          dateForwarded: ticket.dateForwarded.toISOString(),
          dateReceived: ticket.dateReceived?.toISOString() || null,
        };
      });
      console.log(tickets);
      return formattedTickets;
    } catch (error) {
      console.error("Failed to fetch ticket:", error);
      throw new Error("Something went wrong");
    }
  }

  public async updateTicket(ticketId: string, data: z.infer<typeof ticketingMutationSchema>, tx: Prisma.TransactionClient) {

    const {id, ...new_data} = data
    try {
      const result = await tx.ticket.update({
        where: { id: ticketId },
        data: new_data,
        select: {
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
                },
              },
            },
          },
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
          receiverId: true,
          senderId: true,
          createdAt: true,
          updatedAt: true,
          attachments: true,
        },
      });
      const logs = {
        ...result,
        ticketId: result.id,
        sender: `${result.sender.userInfo?.firstName} ${result.sender.userInfo?.lastName}`,
        receiver: `${result.receiver?.userInfo?.firstName} ${result.receiver?.userInfo?.lastName} || null`,
        senderId: result.senderId,
        receiverId: result.receiverId || null,
        dateForwarded: result.dateForwarded.toISOString(),
        dateReceived: result.dateReceived?.toISOString() || null,
        createdAt: result.createdAt.toISOString(),
        updatedAt: result.updatedAt.toISOString(),
      };

      return logs;
    } catch (error) {
      console.error("Failed to update ticket:", error);
      throw new Error("Failed to update ticket");
    }
  }

  public async receiveTicketService(id: string, dateReceived: string, tx: Prisma.TransactionClient) {
    try {
      const response = await db.ticket.update({
        where: {
          id: id,
        },
        data: {
          dateReceived: dateReceived,
        },
        select: {
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
                },
              },
            },
          },
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
          receiverId: true,
          senderId: true,
          createdAt: true,
          updatedAt: true,
          attachments: true,
        },
      });
      const logs = {
        ...response,
        sender: `${response.sender.userInfo?.firstName} ${response.sender.userInfo?.lastName}`,
        receiver: `${response.receiver?.userInfo?.firstName} ${response.receiver?.userInfo?.lastName}` || null,
        dateForwarded: response.dateForwarded.toISOString(),
        dateReceived: response.dateReceived?.toISOString() || null,
        createdAt: response.createdAt.toISOString(),
        updatedAt: response.updatedAt.toISOString(),
      };
      return logs;
    } catch (error) {
      console.error("Failed to receive ticket:", error);
      throw new Error("Something went wrong");
    }
  }

  public async resolveTicketService(id: string, userId: string) {
    try {
      const resolvedTicket = await db.ticket.update({
        where: {
          id: id,
        },
        data: {
          senderId: userId,
          receiverId: null,
          dateReceived: null,
          status: "RESOLVED",
        },
        include: {
          project: true,
          transaction: true,
          sender: {
            include: {
              userInfo: true,
            },
          },
          receiver: {
            include: {
              userInfo: true,
            },
          },
        },
      });
      const formattedData = {
        ...resolvedTicket,
        ticketId: resolvedTicket.id,
        sender: `${resolvedTicket.sender.userInfo?.firstName} ${resolvedTicket.sender.userInfo?.lastName}`,
        senderId: resolvedTicket.senderId,
        receiver: resolvedTicket.receiver ? `${resolvedTicket.receiver?.userInfo?.firstName} ${resolvedTicket.receiver?.userInfo?.lastName}` : null,
        receiverId: null,
        dateForwarded: resolvedTicket.dateForwarded.toISOString(),
        dateReceived: null,
        createdAt: resolvedTicket.createdAt.toISOString(),
        updatedAt: resolvedTicket.updatedAt.toISOString(),
        attachments: resolvedTicket.attachments,
      };
      return  formattedData;
    } catch (error) {
      console.log(error);
      throw new Error ("Something went wrong");
    }
  }

  public async reopenTicketService(id: string, userId: string){
    try {
      const reopenTicket = await db.ticket.update({
        where: {
          id: id,
        },
        data: {
          status: "REOPENED",
        },
        include: {
          project: true,
          transaction: true,
          sender: {
            include: {
              userInfo: true,
            },
          },
          receiver: {
            include: {
              userInfo: true,
            },
          },
        },
      });
      const formattedData = {
        ...reopenTicket,
        ticketId: reopenTicket.id,
        sender: `${reopenTicket.sender.userInfo?.firstName} ${reopenTicket.sender.userInfo?.lastName}`,
        receiver: `${reopenTicket.receiver?.userInfo?.firstName} ${reopenTicket.receiver?.userInfo?.lastName} || null`,
        dateForwarded: reopenTicket.dateForwarded.toISOString(),
        dateReceived: null,
        createdAt: reopenTicket.createdAt.toISOString(),
        updatedAt: reopenTicket.updatedAt.toISOString(),
        attachments: reopenTicket.attachments,
      };
      return formattedData;
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong");
    }
  }

  public async getLastId() {
    try {
      const response = await db.ticket.findFirst({
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        select: {
          ticketId: true,
        },
      });
      if (!response) {
        return null;
      }
      return response?.ticketId;
    } catch (error) {
      throw new Error("Error fetching last ID");
    }
  }

  public async getNumOfTicketsService(query: string, status?: string, userId?: string) {
    var condition: any = {};
    if (status === "INBOX") {
      condition = {
        receiverId: userId,
        dateReceived: {
          not: null,
        },
      };
    } else if (status === "INCOMING") {
      condition = {
        receiverId: userId,
        dateReceived: {
          equals: null,
        },
      };
    } else if (status === "RESOLVED") {
      condition = {
        status: {
          equals: status,
        },
      };
    } else if (status === "ON_PROCESS") {
      condition = {
        status: {
          equals: status,
        },
      };
    } else if (status === "COMPLETED") {
      condition = {
        status: {
          equals: status,
        },
      };
    } else if (status === "APPROVED") {
      condition = {
        status: {
          equals: status,
        },
      };
    } else if (status === "SIGN_AND_SEAL") {
      condition = {
        status: {
          equals: status,
        },
      };
    } else {
      condition = {
        status: {
          not: "RESOLVED",
        },
      };
      try {
        const ticketCount = await db.ticket.count({
          where: {
            AND: [
              condition,
              {
                OR: [
                  { ticketId: { contains: query, mode: "insensitive" } },
                  { subject: { contains: query, mode: "insensitive" } },
                  { section: { contains: query, mode: "insensitive" } },
                  { division: { contains: query, mode: "insensitive" } },
                  { priority: { contains: query, mode: "insensitive" } },
                ],
              },
            ],
          },
        }); 
        return ticketCount;
      } catch (error) {

      }
    }
  }
}
