import { Request, Response } from "express";
import { asyncWrapper } from "../utils/index.js";
import { ProfileService } from "../services/profile.service.js";

class ProfileController {
    private readonly profileService: ProfileService;

    constructor() {
        this.profileService = new ProfileService();
    }

    public getByUserIdHandler = asyncWrapper(
        async (req: Request, res: Response) => {
            const userId = BigInt(req.params.userId as string);
            const profile = await this.profileService.getProfileByUserId(userId);
            res.json({ status: true, data: profile });
        }
    );

    public upsertHandler = asyncWrapper(async (req: Request, res: Response) => {
        const userId = BigInt(req.params.userId as string);
        const profile = await this.profileService.upsertProfile(userId, req.body);
        res.json({
            status: true,
            message: "Profile updated successfully",
            data: profile,
        });
    });

    public updateSettingsHandler = asyncWrapper(
        async (req: Request, res: Response) => {
            const userId = BigInt(req.params.userId as string);
            const profile = await this.profileService.updateProfileSettings(
                userId,
                req.body
            );
            res.json({
                status: true,
                message: "Profile settings updated successfully",
                data: profile,
            });
        }
    );
}

export default new ProfileController();
