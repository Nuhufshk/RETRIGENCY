import { Request, Response } from "express";
import { asyncWrapper } from "../utils/index.js";
import { NotificationService } from "../services/notification.service.js";

class NotificationController {
    private readonly notificationService: NotificationService;

    constructor() {
        this.notificationService = new NotificationService();
    }

    public createHandler = asyncWrapper(async (req: Request, res: Response) => {
        const notification = await this.notificationService.createNotification(req.body);
        res.status(201).json({ status: true, message: "Notification created successfully", data: notification });
    });

    public getByIdHandler = asyncWrapper(async (req: Request, res: Response) => {
        const id = String(req.params.id);
        const notification = await this.notificationService.getNotificationById(id);
        res.json({ status: true, data: notification });
    });

    public getAllHandler = asyncWrapper(async (req: Request, res: Response) => {
        const notifications = await this.notificationService.getAllNotifications();
        res.json({ status: true, data: notifications });
    });

    public updateHandler = asyncWrapper(async (req: Request, res: Response) => {
        const id = String(req.params.id);
        const notification = await this.notificationService.updateNotification(id, req.body);
        res.json({ status: true, message: "Notification updated successfully", data: notification });
    });

    public deleteHandler = asyncWrapper(async (req: Request, res: Response) => {
        const id = String(req.params.id);
        await this.notificationService.deleteNotification(id);
        res.json({ status: true, message: "Notification deleted successfully" });
    });
}

export default new NotificationController();
