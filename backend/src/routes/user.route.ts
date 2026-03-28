import { Router } from "express";
import UserController from "../controller/user.controller.js";
import { validateBody } from "../utils/index.js";
import { authorization } from "../middleware/authorization.js";
import { createUserSchema, updateUserSchema } from "../schema/index.js";

const router = Router();

router.use(authorization);

router.post("/", validateBody(createUserSchema), UserController.createHandler);
router.get("/", UserController.getAllHandler);
router.get("/:id", UserController.getByIdHandler);
router.patch(
    "/:id",
    validateBody(updateUserSchema),
    UserController.updateHandler
);
router.delete("/:id", UserController.deleteHandler);

export default router;
