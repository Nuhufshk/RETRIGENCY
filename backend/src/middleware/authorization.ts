import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
const { TokenExpiredError, JsonWebTokenError } = jwt;
import jwtConfig from "../config/jwt.config.js";
import { IPayload } from "../types/index.js";
import { ServiceError } from "../utils/index.js";

export const authorization = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const origin = req.headers.origin;
        const cookies = req.cookies;
        console.log(`[Auth Check] Origin: ${origin}, Cookies received: ${Object.keys(cookies || {})}`);
        
        const authHeader = req.cookies.token;

        if (!authHeader)
            return res
                .status(401)
                .json({ message: "Unauthorized: No token provided", status: false });

        const token = authHeader;

        const decodedToken = jwtConfig.verifyToken(token, "access") as IPayload;

        req.user = decodedToken;
        next();
    } catch (error) {
        console.error("Authorization Error:", error);

        if (error instanceof ServiceError) {
            const serviceErr = error as ServiceError;
            return res
                .status(serviceErr.statusCode)
                .json({ message: serviceErr.message, status: serviceErr.status });
        }

        if (error instanceof TokenExpiredError)
            return res.status(401).json({ message: "Token expired", status: false });

        if (error instanceof JsonWebTokenError)
            return res.status(401).json({ message: "Invalid token", status: false });

        return res.status(401).json({ message: "Unauthorized", status: false });
    }
};
