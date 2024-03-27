import Joi from "joi";

const signupSchema = Joi.object({
    email: Joi.string().email().required().lowercase().trim(),
    username: Joi.string().required().min(8).trim(),
    password: Joi.string().required().min(8)
});

const loginSchema = Joi.object({
    username: Joi.string().required().trim(),
    password: Joi.string().required().min(8)
});

export {
    signupSchema,
    loginSchema
}