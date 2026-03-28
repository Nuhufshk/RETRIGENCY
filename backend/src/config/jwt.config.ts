import jwt from "jsonwebtoken";
import "dotenv/config";
import { IJwtConfig, IPayload, IToken } from "../types/index.js";

class JwtConfig implements IJwtConfig {
    private secret: string;
    private expiresIn: string;
    private refreshSecret: string;
    private refreshExpiresIn: string;

    constructor() {
        this.secret = process.env.JWT_SECRET || "secret";
        this.expiresIn = process.env.JWT_EXPIRES_IN || "1h";
        this.refreshSecret = process.env.JWT_REFRESH_SECRET || "refresh-secret";
        this.refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
    }

    private generateToken(payload: IPayload, type: "access" | "refresh"): string {
        if (type === "access") {
            return jwt.sign(payload, this.secret, {
                expiresIn: this.expiresIn as any,
            });
        }

        return jwt.sign(payload, this.refreshSecret, {
            expiresIn: this.refreshExpiresIn as any,
        });
    }

    public verifyToken(token: string, type: "access" | "refresh"): any {
        if (type === "access") return jwt.verify(token, this.secret);
        return jwt.verify(token, this.refreshSecret);
    }

    public generateTokens(payload: IPayload): IToken {
        return {
            accessToken: this.generateToken(payload, "access"),
            refreshToken: this.generateToken(payload, "refresh"),
        };
    }
}

export default new JwtConfig();
