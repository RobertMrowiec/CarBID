const Auction = require('../../models/Auction')
const { defaultResponse, url } = require('../common')
const { auctionValidate } = require('../../validation/auction')
const { auctionSerialize } = require('../../serializers/auctions')
exports.get = defaultResponse(() => Auction.find().populate('car').populate('offer').then(data => auctionSerialize(data)))

exports.getById = defaultResponse(async req => auctionSerialize( await Auction.findById(req.params.id).populate('car').populate('offer')))

exports.pagination = defaultResponse(async req => {
	const match = req.query.user ? { user: req.query.user } : {}
	const number = +req.query.page.number
	const size = +req.query.page.size

	const totalPages = Math.ceil(await (req.query.user ? Auction.countDocuments(match) : Auction.countDocuments())/ size)

	const links = {
		self: `${url(req)}/api/auctions?page[number]=${number}&page[size]=${size}`,
		first: `${url(req)}/api/auctions?page[number]=1&page[size]=${size}`,
		prev: number - 1 < 1 ? null : `${url(req)}/api/auctions?page[number]=${number - 1}&page[size]=${size}`,
		next: number + 1 > totalPages ? null : `${url(req)}/api/auctions?page[number]=${number + 1}&page[size]=${size}`,
		last: `${url(req)}/api/auctions?page[number]=${totalPages}&page[size]=${size}`
	}

	if (req.query.user) for (x of Object.keys(links)) {
		if (links[x]) links[x] += `&user=${req.query.user}`
	}
	
	return auctionSerialize(await Auction.find(match).sort('-endDate').populate('car').skip(size * (number - 1)).limit(size), links, { 'total': totalPages })
})

exports.add = defaultResponse(async req => {
	const { data } = req.body
	const { relationships: { car, user} } = data

	const body = { ...data.attributes, car: car.data.id, user: user.data.id }

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