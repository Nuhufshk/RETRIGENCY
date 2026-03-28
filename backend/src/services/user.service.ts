import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import { createError } from "../utils/index.js";
import { ICreateUserDto, IUpdateUserDto } from "../dto/index.js";

export class UserService {
    public async createUser(data: ICreateUserDto) {
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser)
            throw createError("User with this email already exists", 400);

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
            },
        });

        return {
            id: user.id,
            email: user.email,
        };
    }

    public async getUserById(id: bigint) {
        const user = await prisma.user.findUnique({
            where: { id },
            include: { profile: true },
            omit: {
                password: true
            }
        });

        if (!user) throw createError("User not found", 404);

        return user;
    }

    public async getAllUsers() {
        return await prisma.user.findMany({
            include: { profile: true },
            omit: {
                password: true
            }
        });
    }

    public async updateUser(id: bigint, data: IUpdateUserDto) {
        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) throw createError("User not found", 404);

        const updateData: any = { ...data };
        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 10);
        }

        return await prisma.user.update({
            where: { id },
            data: updateData,
        });
    }

    public async deleteUser(id: bigint) {
        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) throw createError("User not found", 404);

        return await prisma.user.delete({
            where: { id },
        });
    }
}
