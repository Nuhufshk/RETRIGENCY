import { Router } from "express";
import departmentController from "../controller/department.controller.js";
import { authorization } from "../middleware/authorization.js";

const router = Router();

router.get("/", authorization, departmentController.getAllHandler);

export default router;
