const Joi = require('joi')

const carValidate = (body) => {
    const CarSchema = Joi.object().keys({
        horsePower: Joi.number().min(0),
        maxTorque: Joi.number().min(0),
    }).unknown()

    return Joi.validate(body, CarSchema).then(x => x).catch(err => err.details.map(d => d.message))
}
module.exports.carValidate = carValidate