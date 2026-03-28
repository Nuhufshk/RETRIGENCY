import { Router } from "express";
import PatientController from "../controller/patient.controller.js";
import { validateBody } from "../utils/index.js";
import { authorization } from "../middleware/authorization.js";
import { createPatientSchema, updatePatientSchema } from "../schema/index.js";

const router = Router();

router.use(authorization);

router.post(
    "/",
    validateBody(createPatientSchema),
    PatientController.createHandler
);
router.get("/", PatientController.getAllHandler);
router.get("/:id", PatientController.getByIdHandler);
router.patch(
    "/:id",
    validateBody(updatePatientSchema),
    PatientController.updateHandler
);
router.delete("/:id", PatientController.deleteHandler);

export default router;
