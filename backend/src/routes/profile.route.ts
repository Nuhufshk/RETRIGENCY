import { Router } from "express";
import ProfileController from "../controller/profile.controller.js";
import { validateBody } from "../utils/index.js";
import { authorization } from "../middleware/authorization.js";
import { upsertProfileSchema, updateProfileSettingsSchema } from "../schema/index.js";

const router = Router();

router.use(authorization);

router.get("/:userId", ProfileController.getByUserIdHandler);
router.post(
    "/:userId",
    validateBody(upsertProfileSchema),
    ProfileController.upsertHandler
);
router.patch(
    "/:userId/settings",
    validateBody(updateProfileSettingsSchema),
    ProfileController.updateSettingsHandler
);

export default router;
