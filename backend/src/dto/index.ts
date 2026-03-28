export interface ILoginDto {
    staffId: string;
    password: string;
}

export interface ICreateUserDto {
    email: string;
    password: string;
}

export interface IUpdateUserDto {
    email?: string;
    password?: string;
}

export interface IUpsertProfileDto {
    staffId: string; // Will be converted to bigint
    firstName: string;
    middleName?: string;
    lastName: string;
    departmentId?: string; // Will be converted to bigint
}

export interface IUpdateProfileSettingsDto {
    theme?: "light" | "dark";
    textSize?: "small" | "medium" | "large" | "xLarge";
    emailNotification?: boolean;
    pushNotification?: boolean;
    smsNotification?: boolean;
    language?: "english" | "french" | "spanish" | "german";
}

export interface ICreatePatientDto {
    doctorId: string;
    firstName: string;
    surname: string;
    otherNames?: string;
    dob: string;
    gender: "Male" | "Female" | "Other";
    bloodType: "A" | "B" | "AB" | "O" | "A_POSITIVE" | "A_NEGATIVE" | "B_POSITIVE" | "B_NEGATIVE" | "AB_POSITIVE" | "AB_NEGATIVE" | "O_POSITIVE" | "O_NEGATIVE";
    admissionDate: string;
    address: string;
    contact: string;
    ghanaCard?: string;
    emergencyContact1: string;
    emergencyContact2?: string;
    photo?: string;
}

export interface IUpdatePatientDto {
    doctorId?: string;
    firstName?: string;
    surname?: string;
    otherNames?: string;
    dob?: string;
    gender?: "Male" | "Female" | "Other";
    bloodType?: "A" | "B" | "AB" | "O" | "A_POSITIVE" | "A_NEGATIVE" | "B_POSITIVE" | "B_NEGATIVE" | "AB_POSITIVE" | "AB_NEGATIVE" | "O_POSITIVE" | "O_NEGATIVE";
    admissionDate?: string;
    status?: "Active" | "Inactive";
    address?: string;
    contact?: string;
    ghanaCard?: string;
    emergencyContact1?: string;
    emergencyContact2?: string;
    photo?: string;
}

export interface ICreateNotificationDto {
    title: string;
    message: string;
}

export interface IUpdateNotificationDto {
    title?: string;
    message?: string;
}

