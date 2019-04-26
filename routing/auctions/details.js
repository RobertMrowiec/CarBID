const Auction = require('../../models/Auction')
const { defaultResponse, url } = require('../common')
const { auctionValidate } = require('../../validation/auction')
const { auctionSerialize } = require('../../serializers/auctions')
exports.get = defaultResponse(() => Auction.find().populate('car').populate('offer').then(data => auctionSerialize(data)))

exports.getById = defaultResponse(async req => auctionSerialize( await Auction.findById(req.params.id).populate('car').populate('offer')))

exports.pagination = defaultResponse(async req => {
	const number = +req.query.page.number
	const size = +req.query.page.size
	const totalPages = Math.ceil(await Auction.countDocuments() / size)
	const links = {
		self: `${url(req)}/api/auctions?page[number]=${number}&page[size]=${size}`,
		first: `${url(req)}/api/auctions?page[number]=1&page[size]=${size}`,
		prev: number - 1 < 1 ? null : `${url(req)}/api/auctions?page[number]=${number - 1}&page[size]=${size}`,
		next: number + 1 > totalPages ? null : `${url(req)}/api/auctions?page[number]=${number + 1}&page[size]=${size}`,
		last: `${url(req)}/api/auctions?page[number]=${totalPages}&page[size]=${size}`
	}

	return auctionSerialize(await Auction.find().sort('-endDate').populate('car').skip(size * (number - 1)).limit(size), links, { 'total': totalPages })
})

exports.byUser = defaultResponse(async req => auctionSerialize( await Auction.find({ user: req.params.userId}).exec()))

exports.add = defaultResponse(async req => {
	const { data } = req.body
	const { relationships } = data

	const body = { ...data.attributes, car: relationships.car.data.id, user: relationships.user.data.id }

	if (req.file) {
		body.image = `http://localhost:8008/${req.file.path}`
	}

	const result = await auctionValidate(body)
	return !result.length ? new Auction(body).save().then(data => auctionSerialize(data)) : result
})

exports.update = defaultResponse(async req => {
	const result = await auctionValidate(req.body)
	return !result.length ? Auction.findByIdAndUpdate(req.params.id, req.body, {new: true}) : result
})

exports.delete = defaultResponse(req => Auction.findByIdAndDelete(req.params.id))