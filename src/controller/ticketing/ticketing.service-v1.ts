import { Prisma } from "@prisma/client";
import { db } from "../../prisma";
import * as z from "zod";
import { ticketingFormData, ticketingLogsData } from "./ticketing.schema";

type Ticket = z.infer<typeof ticketingFormData>;

export class TicketingService {
  public async insertTicket(
    data: z.infer<typeof ticketingFormData>,
    tx: Prisma.TransactionClient
  ) {
    const { receiverId, status, attachments } = data;

    try {
      const createdTicket = await tx.ticket.create({
        data: {
          ...data,
          ticketId: data.ticketId!,
          receiverId: status === "ARCHIVED" ? "" : receiverId,
          remarks: data.remarks ?? "",
          projectId: data.projectId ?? undefined,
          transactionId: data.transactionId ?? undefined,
          attachments: attachments ?? undefined,
        },
        include: {
          project: true,
          transaction: true,
        },
      });

      const modifiedTicket = {
        ...createdTicket,
        dueDate: createdTicket.dueDate.toISOString(),
      };

      throw new Error("Rollback for test");
      return modifiedTicket;
    } catch (error) {
      console.error("Rollback triggered:", error);
      return { message: "Test completed, changes were not committed." };
    }
  }
}