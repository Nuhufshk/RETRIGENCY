import { Router } from "express";
import AuthenticationController from "../controller/authentication.js";
import { validateBody } from "../utils/index.js";
import { loginSchema, forgotPasswordSchema } from "../schema/index.js";
import { authorization } from "../middleware/authorization.js";

const router = Router();

router.post("/login", validateBody(loginSchema), AuthenticationController.loginHandler);
router.post("/forgot-password", validateBody(forgotPasswordSchema), AuthenticationController.forgotPasswordHandler);
router.post("/logout", AuthenticationController.logoutHandler);
router.post("/refresh", AuthenticationController.refreshTokenHandler);
router.get("/me", authorization, AuthenticationController.meHandler);

export default router;
