const { Joi } = require('@hapi/joi');

//RegisterValidator for registering new users
const registerValidator = (body) => {
    const schema = Joi.object({
        name: Joi.string().min(5).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    });

    return schema.validate(body);
}

//LoginValidator for login




module.exports.registerValidator = registerValidator;