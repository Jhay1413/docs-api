import { db } from "../../prisma";

export class DashboardService {
  public async getDashboardPriority() {
    try {
      const transactions = await db.transaction.findMany({
        where: {
          status: {
            not: "ARCHIVED",
          },
        },
        take: 10,
        select: {
          id: true,
          transactionId: true,
          percentage: true,
          project: {
            select: {
              projectName: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return transactions;
    } catch (error) {
      console.error("Error fetching data", error);
      throw new Error("Failed to fetch data");
    }
  }
  public async getNumberPerApplication() {
    try {
      const transactions = await db.transaction.groupBy({
        by: ["category"],
        _count: {
          id: true,
        },
        where: {
          status: {
            not: "ARCHIVED",
          },
        },
      });
      const countEachType = transactions.map((item) => ({
        category: item.category,
        count: item._count.id,
      }));
      return countEachType;
    } catch (error) {
      console.error("Error fetching transaction", error);
      throw new Error("Failed to fetch transactions");
    }
  }
  public async getNumberPerSection() {
    try {
      const transactions = await db.transaction.groupBy({
        by: ["team"],
        _count: {
          id: true,
        },
        where: {
          status: {
            not: "ARCHIVED",
          },
        },
      });
      const data = transactions.map((item) => ({
        section: item.team,
        count: item._count.id,
      }));
      return data;
    } catch (error) {
      console.error("Error fetching transaction", error);
      throw new Error("Failed to fetch transactions");
    }
  }
  public async getTotalNumberOfProjects() {
    try {
      const transactions = await db.transaction.count({
        where: {
          status: {
            not: "ARCHIVED",
          },
        },
      });
      return transactions;
    } catch (error) {
      console.error("Error fetching transaction", error);
      throw new Error("Failed to fetch transactions");
    }
  }
}
