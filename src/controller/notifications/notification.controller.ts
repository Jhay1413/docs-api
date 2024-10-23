import { NotificationService } from "./notification.service";

export class NotificationController {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }
  public async readNotificationController(id: string, isRead: string) {
    try {
      await this.notificationService.readNotificationService(id, isRead);
      return;
    } catch (error) {
      throw new Error("Something went wrong change status of notification!");
    }
  }
  public async getNotificationsByUserController(id: string) {
    try {
      const response = this.notificationService.getNotificationsByUserIdService(id);
      return response;
    } catch (error) {
      throw new Error("Something went wrong change status of notification!");
    }
  }
}
