import { Request, Response } from "express";
import { asyncWrapper } from "../utils/index.js";
import { UserService } from "../services/user.service.js";

class UserController {
    private readonly userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    public createHandler = asyncWrapper(async (req: Request, res: Response) => {
        const user = await this.userService.createUser(req.body);
        res.status(201).json({ status: true, message: "User created successfully", data: user });
    });

    public getByIdHandler = asyncWrapper(async (req: Request, res: Response) => {
        const id = BigInt(req.params.id as string);
        const user = await this.userService.getUserById(id);
        res.json({ status: true, data: user });
    });

    public getAllHandler = asyncWrapper(async (req: Request, res: Response) => {
        const users = await this.userService.getAllUsers();
        res.json({ status: true, data: users });
    });

    public updateHandler = asyncWrapper(async (req: Request, res: Response) => {
        const id = BigInt(req.params.id as string);
        const user = await this.userService.updateUser(id, req.body);
        res.json({ status: true, message: "User updated successfully", data: user });
    });

    public deleteHandler = asyncWrapper(async (req: Request, res: Response) => {
        const id = BigInt(req.params.id as string);
        await this.userService.deleteUser(id);
        res.json({ status: true, message: "User deleted successfully" });
    });
}

export default new UserController();
