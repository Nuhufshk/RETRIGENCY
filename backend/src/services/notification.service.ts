import { prisma } from "../lib/prisma.js";
import { createError } from "../utils/index.js";
import { ICreateNotificationDto, IUpdateNotificationDto } from "../dto/index.js";

export class NotificationService {
    public async createNotification(data: ICreateNotificationDto) {
        return await prisma.notification.create({
            data: {
                title: data.title,
                message: data.message,
            },
        });
    }

    public async getAllNotifications() {
        return await prisma.notification.findMany({
            orderBy: { createdAt: "desc" },
        });
    }

    public async getNotificationById(id: string) {
        const notification = await prisma.notification.findUnique({
            where: { id },
        });

        if (!notification) throw createError("Notification not found", 404);

        return notification;
    }

    public async updateNotification(id: string, data: IUpdateNotificationDto) {
        const notification = await prisma.notification.findUnique({
            where: { id },
        });

        if (!notification) throw createError("Notification not found", 404);

        return await prisma.notification.update({
            where: { id },
            data,
        });
    }

    public async deleteNotification(id: string) {
        const notification = await prisma.notification.findUnique({
            where: { id },
        });

        if (!notification) throw createError("Notification not found", 404);

        return await prisma.notification.delete({
            where: { id },
        });
    }
}
