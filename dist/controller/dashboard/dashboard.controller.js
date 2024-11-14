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
exports.DashboardController = void 0;
const dashboard_service_1 = require("./dashboard.service");
class DashboardController {
    constructor() {
        this.dashboardService = new dashboard_service_1.DashboardService();
    }
    getDashboardData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const priority = yield this.dashboardService.getDashboardPriority();
                const perApplication = yield this.dashboardService.getNumberPerApplication();
                const perSection = yield this.dashboardService.getNumberPerSection();
                const total = yield this.dashboardService.getTotalNumberOfProjects();
                const data = {
                    priority,
                    perApplication,
                    perSection,
                    totalProject: total,
                };
                return data;
            }
            catch (error) {
                console.log(error);
                throw new Error("something went wrong");
            }
        });
    }
}
exports.DashboardController = DashboardController;
