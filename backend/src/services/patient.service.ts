import { prisma } from "../lib/prisma.js";
import { createError } from "../utils/index.js";
import { ICreatePatientDto, IUpdatePatientDto } from "../dto/index.js";

export class PatientService {
    public async createPatient(data: ICreatePatientDto) {
        const patient = await prisma.patient.create({
            data: {
                doctorId: BigInt(data.doctorId),
                firstName: data.firstName,
                surname: data.surname,
                otherNames: data.otherNames,
                dob: new Date(data.dob),
                gender: data.gender,
                bloodType: data.bloodType,
                admissionDate: new Date(data.admissionDate),
                address: data.address,
                contact: data.contact,
                ghanaCard: data.ghanaCard,
                emergencyContact1: data.emergencyContact1,
                emergencyContact2: data.emergencyContact2,
                photo: data.photo,
            },
        });

        return patient;
    }

    public async getPatientById(id: bigint) {
        const patient = await prisma.patient.findUnique({
            where: { id },
            include: {
                doctor: {
                    select: {
                        profile: {
                            select: { firstName: true, lastName: true, id: true },
                        },
                    },
                },
            },
        });

        if (!patient) throw createError("Patient not found", 404);

        return patient;
    }

    public async getAllPatients() {
        return await prisma.patient.findMany({
            include: { doctor: { select: { email: true } } },
        });
    }

    public async updatePatient(id: bigint, data: IUpdatePatientDto) {
        const patient = await prisma.patient.findUnique({
            where: { id },
        });

        if (!patient) throw createError("Patient not found", 404);

        const updateData: any = { ...data };
        if (data.doctorId) updateData.doctorId = BigInt(data.doctorId);
        if (data.dob) updateData.dob = new Date(data.dob);
        if (data.admissionDate)
            updateData.admissionDate = new Date(data.admissionDate);

        return await prisma.patient.update({
            where: { id },
            data: updateData,
        });
    }

    public async deletePatient(id: bigint) {
        const patient = await prisma.patient.findUnique({
            where: { id },
        });

        if (!patient) throw createError("Patient not found", 404);

        return await prisma.patient.delete({
            where: { id },
        });
    }
}
