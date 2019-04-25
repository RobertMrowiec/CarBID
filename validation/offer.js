const Joi = require('joi')

const offerValidate = (body) => {
	const OfferSchema = Joi.object().keys({
		price: Joi.number().min(0)
	}).unknown()

	return Joi.validate(body, OfferSchema)
		.then(validationResult => validationResult)
		.catch(err => err.details.map(d => d.message))
}
module.exports.offerValidate = offerValidate