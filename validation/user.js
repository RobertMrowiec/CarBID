const Joi = require('joi')

const userValidate = (body) => {
	const UserSchema = Joi.object().keys({
		password: Joi.string().min(6),
		email: Joi.string().regex(/([a-zA-Z0-9.-])\w+[@]+(herecars.com)$/),
		name: Joi.string().required()
	}).unknown()

	return Joi.validate(body, UserSchema)
		.then(validationResult => validationResult)
		.catch(validationError => { throw validationError.details.map(d => d.message) })
}

module.exports.userValidate = userValidate