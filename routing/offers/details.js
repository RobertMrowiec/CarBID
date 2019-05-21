const Offer = require('../../models/Offer')
const { defaultResponse } = require('../common')
const { offerValidate } = require('../../validation/offer')

exports.get = defaultResponse(() => Offer.find().populate('auction').populate('user'))

exports.getById = defaultResponse(req => Offer.findById(req.params.id).populate('auction').populate('user'))

exports.pagination = defaultResponse(req => {
	const { limit, page } = +req.params
	return Offer.find().populate('auction').populate('user').skip(limit * (page - 1)).limit(limit)
})

exports.add = defaultResponse(async req => {
	const { body } = req
	const result = await offerValidate(body)
	return !result.length ? new Offer(body).save() : result
})

exports.update = defaultResponse(async req => {
	const { body } = req
	const { id } = req.params
	const result = await offerValidate(body)
	return !result.length ? Offer.findByIdAndUpdate(id, body, { new: true }) : result
})

exports.delete = defaultResponse(req => Offer.findByIdAndDelete(req.params.id))