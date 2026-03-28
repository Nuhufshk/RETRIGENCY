import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import { createError } from "../utils/index.js";
import jwtConfig from "../config/jwt.config.js";

export class AuthService {
    public async login(staffId: bigint, password: string) {
        const profile = await prisma.profile.findUnique({
            where: {
                staffId: staffId,
            },
            include: {
                user: true,
                department: true,
            },
        });

        if (!profile) throw createError("User not found", 404);

        const isPasswordValid = await bcrypt.compare(password, profile.user?.password);

        if (!isPasswordValid)
            throw createError("Invalid password or staff ID", 401);

        const token = jwtConfig.generateTokens({
            id: Number(profile.id),
            email: profile.user.email,
        });

        // Remove password from the returned user object
        const { password: _, ...userWithoutPassword } = profile.user;

        return {
            token,
            profile: {
                ...profile,
                user: userWithoutPassword,
            },
        };
    }

    public async refreshService(refreshToken: string) {
        const token = jwtConfig.verifyToken(refreshToken, "refresh");
        const user = await prisma.user.findUnique({
            where: {
                id: token.id,
            },
        });

        if (!user) throw createError("User not found", 404);
        const newToken = jwtConfig.generateTokens({
            id: Number(user.id),
            email: user.email,
        });

        return newToken;
    }
}
