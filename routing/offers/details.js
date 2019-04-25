const Offer = require('../../models/Offer')
const { defaultResponse } = require('../common')
const { offerValidate } = require('../../validation/offer')

exports.get = defaultResponse(() => Offer.find().populate('auction').populate('user'))

exports.getById = defaultResponse(req => Offer.findById(req.params.id).populate('auction').populate('user'))

exports.pagination = defaultResponse(req => {
	const limit = Number(req.params.limit)
	return Offer.find().populate('auction').populate('user').skip(limit * (req.params.page - 1)).limit(limit)
})

exports.add = defaultResponse(async req => {
	const result = await offerValidate(req.body)
	return !result.length ? new Offer(req.body).save() : result
})

exports.update = defaultResponse(async req => {
	const result = await offerValidate(req.body)
	return !result.length ? Offer.findByIdAndUpdate(req.params.id, req.body, {new: true}) : result
})

exports.delete = defaultResponse(req => Offer.findByIdAndDelete(req.params.id))