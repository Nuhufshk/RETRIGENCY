import { prisma } from "../lib/prisma.js";
import { createError } from "../utils/index.js";
import { IUpsertProfileDto, IUpdateProfileSettingsDto } from "../dto/index.js";

export class ProfileService {
    public async getProfileByUserId(userId: bigint) {
        const profile = await prisma.profile.findUnique({
            where: { id: userId },
            include: { department: true },
        });

        if (!profile) throw createError("Profile not found", 404);

        return profile;
    }

    public async upsertProfile(userId: bigint, data: IUpsertProfileDto) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true },
        });

        if (!user) throw createError("User not found", 404);

        return await prisma.profile.upsert({
            where: { id: userId },
            update: {
                staffId: BigInt(data.staffId),
                firstName: data.firstName,
                middleName: data.middleName,
                lastName: data.lastName,
                departmentId: data.departmentId ? BigInt(data.departmentId) : undefined,
            },
            create: {
                id: userId,
                staffId: BigInt(data.staffId),
                firstName: data.firstName,
                middleName: data.middleName,
                lastName: data.lastName,
                departmentId: data.departmentId ? BigInt(data.departmentId) : undefined,
            },
        });

    }

    public async updateProfileSettings(
        userId: bigint,
        data: IUpdateProfileSettingsDto
    ) {
        const profile = await prisma.profile.findUnique({
            where: { id: userId },
        });

        if (!profile) throw createError("Profile not found", 404);

        return await prisma.profile.update({
            where: { id: userId },
            data: { ...data },
        });
    }
}
