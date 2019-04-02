const Joi = require('joi');

const userValidate = (body) => {
    const UserSchema = Joi.object().keys({
        password: Joi.string().min(6),
        email: Joi.string().regex(/([a-z][a-zA-Z0-9.-])\w+[@]+(herecars.com)/)
    }).unknown()

    return Joi.validate(body, UserSchema).then(x => x).catch(validationError => validationError.details.map(d => d.message))
}

module.exports.userValidate = userValidate