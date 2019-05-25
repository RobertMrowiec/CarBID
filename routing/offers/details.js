const Offer = require('../../models/Offer')
const Auction = require('../../models/Auction')
const { defaultResponse } = require('../common')
const { offerValidate } = require('../../validation/offer')
const { offerSerialize } = require('../../serializers/offers')

exports.get = defaultResponse(() => Offer.find().populate('auction').populate('user'))

exports.getById = defaultResponse(async req => offerSerialize(await Offer.findById(req.params.id).populate('auction').populate('user')))

exports.pagination = defaultResponse(async req => {
	const { limit, page } = +req.params
	return offerSerialize( await Offer.find().populate('auction').populate('user').skip(limit * (page - 1)).limit(limit))
})

exports.add = defaultResponse(async req => {
	const body = _setBody(req)
	const { auction, price } = body
	const result = await offerValidate(body)
	if (!result.length) {		
		return new Offer(body).save().then(async saved => {
			await Auction.findByIdAndUpdate(auction, { minimalPrice: price }, { new: true }).exec()
			return offerSerialize(saved)
		})
	 } else result
})

exports.update = defaultResponse(async req => {
	const { body } = req
	const { id } = req.params
	const result = await offerValidate(body)
	return !result.length ? Offer.findByIdAndUpdate(id, body, { new: true }) : result
})

exports.delete = defaultResponse(req => Offer.findByIdAndDelete(req.params.id))

function _setBody(req) {
	const { data } = req.body
	const { relationships: { auction, user} } = data
	console.log(data);
	
	const { attributes } = data
	return { ...attributes, auction: auction.data.id, user: user.data.id }

}