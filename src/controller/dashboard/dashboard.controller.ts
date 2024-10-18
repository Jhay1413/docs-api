import { dashboardData } from "shared-contract";
import { DashboardService } from "./dashboard.service";
import { z } from "zod";
export class DashboardController {
  private dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService();
  }
  public async getDashboardData(): Promise<z.infer<typeof dashboardData>> {
    try {
      const priority = await this.dashboardService.getDashboardPriority();
      const perApplication = await this.dashboardService.getNumberPerApplication();
      const perSection = await this.dashboardService.getNumberPerSection();
      const total = await this.dashboardService.getTotalNumberOfProjects();

      const data = {
        priority,
        perApplication,
        perSection,
        totalProject: total,
      };

      return data;
    } catch (error) {
      console.log(error);
      throw new Error("something went wrong");
    }
  }
}
