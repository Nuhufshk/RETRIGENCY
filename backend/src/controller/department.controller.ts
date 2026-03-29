import { Request, Response } from "express";
import { asyncWrapper } from "../utils/index.js";
import { DepartmentService } from "../services/department.service.js";

class DepartmentController {
    private readonly departmentService: DepartmentService;

    constructor() {
        this.departmentService = new DepartmentService();
    }

    public getAllHandler = asyncWrapper(async (req: Request, res: Response) => {
        const departments = await this.departmentService.getAllDepartments();
        res.json({ status: true, data: departments });
    });
}

export default new DepartmentController();
