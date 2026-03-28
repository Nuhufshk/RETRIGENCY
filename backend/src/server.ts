import express, { Express, Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import profileRouter from "./routes/profile.route.js";
import patientRouter from "./routes/patient.route.js";
import dashboardRouter from "./routes/dashboard.route.js";
import notificationRouter from "./routes/notification.route.js";
import { ServiceError } from "./utils/index.js";
import compression from "compression";
import cors from "cors";
import "dotenv/config";

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Trust Proxy for Render.com (necessary for secure cookies)
app.set("trust proxy", 1);

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression({ threshold: 1024 }));

//  BigInt to JSON
(BigInt.prototype as any).toJSON = function () {
    return Number(this);
};

// CORS configuration
const allowedOrigins = [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:3000",
    process.env.FRONTEND_URL!,
    "https://retrigencyapp.onrender.com"
].filter(Boolean) as string[];

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps or curl)
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin) || allowedOrigins.some(ao => origin.startsWith(ao))) {
                callback(null, true);
            } else {
                console.warn(`CORS blocked request from origin: ${origin}`);
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    })
);

// cookies configuration
app.use(cookieParser());

// all routed here
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/profiles", profileRouter);
app.use("/api/patients", patientRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/notifications", notificationRouter);

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
    res.send({
        status: "ok",
        timestamp: new Date().toISOString(),
        message: "Server is running",
        uptime: process.uptime(),
        pid: process.pid,
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        memoryUsage: process.memoryUsage(),
    });
});

// unhandled routes
app.use((req: Request, res: Response) => {
    res.status(404).json({ message: "Route not found", status: false });
});

// unhandled errors
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error("Unhandled error", err);

    if (err instanceof ServiceError) {
        const serviceErr = err as ServiceError;
        return res
            .status(serviceErr.statusCode)
            .json({ message: serviceErr.message, status: serviceErr.status });
    }

    res.status(500).json({ message: "Internal server error", status: false });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Health check on http://localhost:${PORT}/health`);
});
