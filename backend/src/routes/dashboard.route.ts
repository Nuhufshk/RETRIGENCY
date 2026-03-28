import { Router } from "express";
import DashboardController from "../controller/dashboard.controller.js";
import { authorization } from "../middleware/authorization.js";

const router = Router();

router.use(authorization);
router.get("/", DashboardController.getDashboardDataHandler);

export default router;
