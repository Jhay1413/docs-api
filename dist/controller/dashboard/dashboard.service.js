"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const prisma_1 = require("../../prisma");
class DashboardService {
    getDashboardPriority() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transactions = yield prisma_1.db.transaction.findMany({
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
            }
            catch (error) {
                console.error("Error fetching data", error);
                throw new Error("Failed to fetch data");
            }
        });
    }
    getNumberPerApplication() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transactions = yield prisma_1.db.transaction.groupBy({
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
            }
            catch (error) {
                console.error("Error fetching transaction", error);
                throw new Error("Failed to fetch transactions");
            }
        });
    }
    getNumberPerSection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transactions = yield prisma_1.db.transaction.groupBy({
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
            }
            catch (error) {
                console.error("Error fetching transaction", error);
                throw new Error("Failed to fetch transactions");
            }
        });
    }
    getTotalNumberOfProjects() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transactions = yield prisma_1.db.transaction.count({
                    where: {
                        status: {
                            not: "ARCHIVED",
                        },
                    },
                });
                return transactions;
            }
            catch (error) {
                console.error("Error fetching transaction", error);
                throw new Error("Failed to fetch transactions");
            }
        });
    }
}
exports.DashboardService = DashboardService;
