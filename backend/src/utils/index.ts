import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const asyncWrapper = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    };
};

export const validateBody = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.body)
                return res
                    .status(400)
                    .json({ message: "Body is required", status: false });

            const { error, value } = schema.validate(req.body);
            if (error)
                return res
                    .status(400)
                    .json({ message: error.details[0].message, status: false });

            req.body = value;
            next();
        } catch (error) {
            res.status(500).json({ message: "Internal server error", status: false });
        }
    };
};

export class ServiceError extends Error {
    public statusCode: number;
    public status: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.name = "ServiceError";
        this.statusCode = statusCode || 500;
        this.status = false;
        this.message = message;
        this.stack = new Error().stack;
    }
}

export const createError = (message: string, statusCode: number) => {
    return new ServiceError(message, statusCode);
};
