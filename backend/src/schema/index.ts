import Joi from "joi";

export const loginSchema = Joi.object({
    staffId: Joi.number().required(),
    password: Joi.string().required(),
});

export const forgotPasswordSchema = Joi.object({
    staffId: Joi.number().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    retrievalModes: Joi.array().items(Joi.string().valid("sms", "email")).min(1).required(),
});

export const createUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

export const updateUserSchema = Joi.object({
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(),
});

export const upsertProfileSchema = Joi.object({
    staffId: Joi.number().required(),
    firstName: Joi.string().max(50).required(),
    middleName: Joi.string().max(50).optional().allow(null, ""),
    lastName: Joi.string().max(50).required(),
    departmentId: Joi.number().optional().allow(null),
});

export const updateProfileSettingsSchema = Joi.object({
    theme: Joi.string().valid("light", "dark").optional(),
    textSize: Joi.string().valid("small", "medium", "large", "xLarge").optional(),
    emailNotification: Joi.boolean().optional(),
    pushNotification: Joi.boolean().optional(),
    smsNotification: Joi.boolean().optional(),
    language: Joi.string().valid("english", "french", "spanish", "german").optional(),
});

export const createPatientSchema = Joi.object({
    doctorId: Joi.number().required(),
    firstName: Joi.string().max(50).required(),
    surname: Joi.string().max(50).required(),
    otherNames: Joi.string().max(50).optional().allow(null, ""),
    dob: Joi.date().required(),
    gender: Joi.string().valid("Male", "Female", "Other").required(),
    bloodType: Joi.string().valid("A", "B", "AB", "O", "A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE", "AB_POSITIVE", "AB_NEGATIVE", "O_POSITIVE", "O_NEGATIVE").required(),
    admissionDate: Joi.date().required(),
    address: Joi.string().max(255).required(),
    contact: Joi.string().max(15).required(),
    ghanaCard: Joi.string().max(20).optional().allow(null, ""),
    emergencyContact1: Joi.string().max(15).required(),
    emergencyContact2: Joi.string().max(15).optional().allow(null, ""),
    photo: Joi.string().optional().allow(null, ""),
});

export const updatePatientSchema = Joi.object({
    doctorId: Joi.number().optional(),
    firstName: Joi.string().max(50).optional(),
    surname: Joi.string().max(50).optional(),
    otherNames: Joi.string().max(50).optional().allow(null, ""),
    dob: Joi.date().optional(),
    gender: Joi.string().valid("Male", "Female", "Other").optional(),
    bloodType: Joi.string().valid("A", "B", "AB", "O", "A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE", "AB_POSITIVE", "AB_NEGATIVE", "O_POSITIVE", "O_NEGATIVE").optional(),
    admissionDate: Joi.date().optional(),
    status: Joi.string().valid("Active", "Inactive").optional(),
    address: Joi.string().max(255).optional(),
    contact: Joi.string().max(15).optional(),
    ghanaCard: Joi.string().max(20).optional().allow(null, ""),
    emergencyContact1: Joi.string().max(15).optional(),
    emergencyContact2: Joi.string().max(15).optional().allow(null, ""),
    photo: Joi.string().optional().allow(null, ""),
});

export const createNotificationSchema = Joi.object({
    title: Joi.string().max(100).required(),
    message: Joi.string().max(255).required(),
});

export const updateNotificationSchema = Joi.object({
    title: Joi.string().max(100).optional(),
    message: Joi.string().max(255).optional(),
});
