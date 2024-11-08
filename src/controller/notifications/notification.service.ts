import { PrismaClient } from "@prisma/client";
import { db } from "../../prisma";

export class NotificationService {
  public async readNotificationService(id: string, dateRead: string) {
    console.log(id);
    try {
      await db.notification.update({
        where: {
          id: id,
        },
        data: {
          isRead: true,
          dateRead: dateRead,
        },
      });
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong updating notification ! ");
    }
  }
  public async getNotificationsByUserIdService(id: string) {
    try {
      const result = await db.notification.findMany({
        where: {
          receiverId: id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const converted_data = result.map((data) => {
        return {
          ...data,
          dateRead: data.dateRead?.toISOString() || null,
          createdAt: data.createdAt.toISOString(),
        };
      });
      return converted_data;
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong fetching notification ! ");
    }
  }
  public async getNumberOfUnreadNotif(id: string) {
    try {
      const result = await db.notification.count({
        where: {
          receiverId: id,
          isRead: false,
        },
      });
      return result;
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong fetching notification ! ");
    }
  }
}
