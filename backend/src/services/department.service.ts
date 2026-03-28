import { prisma } from "../lib/prisma.js";

export class DepartmentService {
    public async getAllDepartments() {
        return await prisma.department.findMany({
            orderBy: { name: "asc" },
        });
    }

    public async getDepartmentById(id: bigint) {
        return await prisma.department.findUnique({
            where: { id },
        });
    }
}
