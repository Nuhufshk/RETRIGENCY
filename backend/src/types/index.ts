interface IUser {
    staffId: bigint;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

interface IProfile {
    staffId: bigint;
    firstName: string;
    middleName: string;
    lastName: string;
    department?: bigint;

    theme: "light" | "dark";
    textSize: "small" | "medium" | "large" | "xLarge";
    emailNotification: boolean;
    pushNotification: boolean;
    smsNotification: boolean;
    language: "english" | "french" | "spanish" | "german";

    createdAt: Date;
    updatedAt: Date;
}

interface IDepartment {
    id: bigint;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IPatient {
    id?: bigint;
    doctorId?: bigint;
    firstName: string;
    surname: string;
    otherNames: string;
    dob: Date;
    gender: string;
    bloodType:
    | "A"
    | "B"
    | "AB"
    | "O"
    | "A_POSITIVE"
    | "A_NEGATIVE"
    | "B_POSITIVE"
    | "B_NEGATIVE"
    | "AB_POSITIVE"
    | "AB_NEGATIVE";
    admissionDate: Date;
    status?: "Active" | "Inactive";
    address: string;
    contact: string;
    ghanaCard?: string;
    emergencyContact1: string;
    emergencyContact2?: string;
    photo?: string;
}

export interface IAdmission {
    id: bigint;
    patientId: string;
    admissionDate: string;
    dischargeDate?: string;
    reason: string;
    ward: string;
    bedNumber?: string;
    admittingStaffId: bigint;
    status: "Admitted" | "Discharged" | "Transferred";
    createdAt: Date;
    updatedAt: Date;
}


export interface IPayload {
    id: bigint | number;
    email: string;
}

export interface IToken {
    accessToken: string;
    refreshToken: string;
}

export interface IJwtConfig {
    verifyToken(token: string, type: "access" | "refresh"): any;
    generateTokens(payload: IPayload): IToken;
}

declare global {
    namespace Express {
        interface Request {
            user?: IPayload;
        }
    }
}

