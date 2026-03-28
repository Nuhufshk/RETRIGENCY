import { Request, Response } from "express";
import { asyncWrapper } from "../utils/index.js";
import { DashboardService } from "../services/dashboard.service.js";

class DashboardController {
    private readonly dashboardService: DashboardService;

    constructor() {
        this.dashboardService = new DashboardService();
    }

    public getDashboardDataHandler = asyncWrapper(async (req: Request, res: Response) => {
        const data = await this.dashboardService.getDashboardData();
        res.json({ status: true, data });
    });
}

export default new DashboardController();
