import { db } from "../../prisma";
import { completeStaffWork } from "./transaction.schema";
import * as z from "zod";
export class TransactionService {
  public async getTransactionByIdService(id: string) {
    try {
      const transaction = await db.transaction.findUnique({
        where: {
          id: id,
        },
        include: {
          company: {
            include: {
              contactPersons: true,
            },
          },
          project: {
            include: {
              contactPersons: true,
            },
          },
          receive: true,
          transactionLogs: true,
          attachments: true,
          completeStaffWork: true,
        },
      });

      const parseResponse = transaction?.transactionLogs.map((respo) => {
        return { ...respo, attachments: JSON.parse(respo.attachments) };
      });
     

      return { ...transaction, transactionLogs: parseResponse };
    } catch (error) {
      console.error("Error fetching transaction", error);
      throw new Error("Failed to fetch transaction");
    }
  }
  public async getTransactionsService() {
    try {
      const transactions = await db.$queryRaw`
        SELECT 
            t.id,
            t."transactionId",
            t."documentType",
            t.subject,
            t."dueDate",
            t."createdAt",
            t."updatedAt",
            t."documentSubType",
            t."forwardedByRole",
            t."originDepartment",
            t."targetDepartment",
            t."dateForwarded",

            t.status,
            t.priority,
            COALESCE(
                (SUM(CASE WHEN a."fileStatus" = 'FINAL_ATTACHMENT' THEN 1 ELSE 0 END) * 100.0) / NULLIF(COUNT(a.id), 0),
                0
            ) AS percentage
        FROM "Transaction" t
        LEFT JOIN "Attachment" a ON t.id = a."transactionId"
        GROUP BY t.id
                `;

    
      return transactions;
    } catch (error) {
      console.error("Error fetching transaction", error);
      throw new Error("Failed to fetch transactions");
    }
  }
  public async updateTransactionCswById(
    transactionId: string,
    data: z.infer<typeof completeStaffWork>
  ) {
    try {
      const response = await db.transaction.update({
        where: {
          id: transactionId,
        },
        data: {
          completeStaffWork: {
            upsert: {
              where: {
                id: data.id || "",
              },
              update: {
                date: data.date,
                remarks: data.remarks,
                attachmentUrl: data.attachmentUrl,
              },
              create: {
                date: data.date,
                remarks: data.remarks,
                attachmentUrl: data.attachmentUrl,
              },
            },
          },
        },
        include: {
          attachments: true,
          forwarder: true,
          receive: true,
          company: true,
          project: true,
          completeStaffWork: true,
        },
      });
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong while adding csw ! ");
    }
  }
}
