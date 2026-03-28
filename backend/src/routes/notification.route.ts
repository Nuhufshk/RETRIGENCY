import { Router } from "express";
import NotificationController from "../controller/notification.controller.js";
import { validateBody } from "../utils/index.js";
import { authorization } from "../middleware/authorization.js";
import { createNotificationSchema, updateNotificationSchema } from "../schema/index.js";

const router = Router();

router.use(authorization);

router.post(
    "/",
    validateBody(createNotificationSchema),
    NotificationController.createHandler
);
router.get("/", NotificationController.getAllHandler);
router.get("/:id", NotificationController.getByIdHandler);
router.patch(
    "/:id",
    validateBody(updateNotificationSchema),
    NotificationController.updateHandler
);
router.delete("/:id", NotificationController.deleteHandler);

export default router;
