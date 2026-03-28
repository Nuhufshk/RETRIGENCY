import { prisma } from "../lib/prisma.js";

export class DashboardService {
    public async getDashboardData() {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

        const [
            totalPatients,
            patientsToday,
            todayAdmissions,
            activeCases,
            recentPatients
        ] = await Promise.all([
            prisma.patient.count(),
            prisma.patient.count({
                where: {
                    createdAt: {
                        gte: startOfToday,
                        lte: endOfToday,
                    },
                },
            }),
            prisma.patient.count({
                where: {
                    admissionDate: {
                        gte: startOfToday,
                        lte: endOfToday,
                    },
                },
            }),
            prisma.patient.count({
                where: { status: "Active" },
            }),
            prisma.patient.findMany({
                take: 8,
                orderBy: { createdAt: "desc" },
                omit: {
                    updatedAt: true,
                    doctorId: true
                }
            }),
        ]);

        return {
            stats: {
                totalPatients: {
                    total: totalPatients,
                    addedToday: patientsToday,
                },
                todayAdmissions: {
                    total: todayAdmissions,
                    pendingVerification: 4, // Mocked as requested
                },
                faceIdScans: {
                    total: 0, // Placeholder
                    today: 0, // Placeholder
                },
                activeCases: {
                    total: activeCases,
                    description: "Currently in hospital",
                },
            },
            recentPatients,
        };
    }
}
