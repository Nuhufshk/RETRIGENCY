import { Request, Response } from "express";
import { asyncWrapper } from "../utils/index.js";
import { AuthService } from "../services/auth.service.js";
import { IToken } from "../types/index.js";


class AuthenticationController {
    private readonly authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    public loginHandler = asyncWrapper(async (req: Request, res: Response) => {
        console.log("Login attempt from origin:", req.headers.origin);
        const { staffId, password } = req.body;
        const { token, profile } = await this.authService.login(staffId, password);

        this.setCookies(res, token);
        res.json({
            status: true,
            message: "Login successful",
            user: profile,
            token: token.accessToken // Fallback for browsers blocking cross-site cookies
        });
    });

    public logoutHandler = asyncWrapper(async (req: Request, res: Response) => {
        res.clearCookie("token");
        res.clearCookie("refreshToken");
        res.json({ status: true, message: "Logout successful" });
    });

    public forgotPasswordHandler = asyncWrapper(async (req: Request, res: Response) => {
        res.json({
            status: true,
            message: "Password reset instructions sent successfully!"
        });
    });

    public refreshTokenHandler = asyncWrapper(async (req: Request, res: Response) => {
        const token = await this.authService.refreshService(req.cookies.refreshToken);
        this.setCookies(res, token);
        res.json({ status: true, message: "Token refreshed successfully" });
    });

    public meHandler = asyncWrapper(async (req: Request, res: Response) => {
        // req.user is populated by the authorization middleware
        res.json({
            status: true,
            user: req.user
        });
    });

    private setCookies(res: Response, token: IToken) {
        const isProduction = process.env.NODE_ENV === "production";
        console.log("Setting cookies with isProduction =", isProduction);

        const cookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? ("none" as const) : ("lax" as const),
            maxAge: 24 * 60 * 60 * 1000,
        };
        console.log("Cookie options:", cookieOptions);

        res.cookie("token", token.accessToken, cookieOptions);
        res.cookie("refreshToken", token.refreshToken, cookieOptions);
    }

}

export default new AuthenticationController();