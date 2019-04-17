const Auction = require('../../models/Auction')
const { defaultResponse, url } = require('../common')
const { auctionValidate } = require('../../validation/auction')
const { auctionSerialize } = require('../../serializers/auctions')

exports.get = defaultResponse(() => Auction.find().populate('car').populate('offer').then(data => auctionSerialize(data)))

exports.getById = defaultResponse(req => Auction.findById(req.params.id).populate('car').populate('offer'))

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

	return auctionSerialize(await Auction.find().sort('-endDate').skip(size * (number - 1)).limit(size), links, { 'total': totalPages })
})

exports.add = defaultResponse(async req => {
	const result = await auctionValidate(req.body)
	return !result.length ? new Auction(req.body).save() : result
})

exports.update = defaultResponse(async req => {
	const result = await auctionValidate(req.body)
	return !result.length ? Auction.findByIdAndUpdate(req.params.id, req.body, {new: true}) : result
})

exports.delete = defaultResponse(req => Auction.findByIdAndDelete(req.params.id))