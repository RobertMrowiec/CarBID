const Joi = require('joi')

const carValidate = (body) => {
	const CarSchema = Joi.object().keys({
		horsePower: Joi.number().min(0),
		maxTorque: Joi.number().min(0),
		brand: Joi.string().required(),
		model: Joi.string().required()
	}).unknown()

	return Joi.validate(body, CarSchema)
		.then(validationResult => validationResult)
		.catch(validationError => validationError.details.map(d => d.message))
}
module.exports.carValidate = carValidate