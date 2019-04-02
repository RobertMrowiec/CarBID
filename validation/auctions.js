const Joi = require('joi');

const auctionValidate = (body) => {
    const AuctionSchema = Joi.object().keys({
        description: Joi.string().max(200),
        minimalPrice: Joi.number().min(0)
    }).unknown()
     
    return Joi.validate(body, AuctionSchema).then(x => x).catch(validationError => validationError.details.map(d => d.message))
}

module.exports.auctionValidate = auctionValidate