import { Request, Response } from "express";
import { asyncWrapper } from "../utils/index.js";
import { PatientService } from "../services/patient.service.js";

class PatientController {
    private readonly patientService: PatientService;

    constructor() {
        this.patientService = new PatientService();
    }

    public createHandler = asyncWrapper(async (req: Request, res: Response) => {
        const patient = await this.patientService.createPatient(req.body);
        res.status(201).json({ status: true, message: "Patient created successfully", data: patient });
    });

    public getByIdHandler = asyncWrapper(async (req: Request, res: Response) => {
        const id = BigInt(req.params.id as string);
        const patient = await this.patientService.getPatientById(id);
        res.json({ status: true, data: patient });
    });

    public getAllHandler = asyncWrapper(async (req: Request, res: Response) => {
        const patients = await this.patientService.getAllPatients();
        res.json({ status: true, data: patients });
    });

    public updateHandler = asyncWrapper(async (req: Request, res: Response) => {
        const id = BigInt(req.params.id as string);
        const patient = await this.patientService.updatePatient(id, req.body);
        res.json({ status: true, message: "Patient updated successfully", data: patient });
    });

    public deleteHandler = asyncWrapper(async (req: Request, res: Response) => {
        const id = BigInt(req.params.id as string);
        await this.patientService.deletePatient(id);
        res.json({ status: true, message: "Patient deleted successfully" });
    });
}

export default new PatientController();
