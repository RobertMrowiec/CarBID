const Auction = require('../../models/Auction')
const { defaultResponse, url } = require('../common')
const { auctionValidate } = require('../../validation/auction')
const { auctionSerialize } = require('../../serializers/auctions')
exports.get = defaultResponse(() => Auction.find().populate('car').populate('offer').then(data => auctionSerialize(data)))

exports.getById = defaultResponse(async req => auctionSerialize( await Auction.findById(req.params.id).populate('car').populate('offer')))

exports.pagination = defaultResponse(async req => {
	const { userId, page } = req.query
	const match = userId ? { user: userId } : {}
	const number = +page.number
	const size = +page.size

	const totalPages = Math.ceil(await (userId ? Auction.countDocuments(match) : Auction.countDocuments()) / size)

	const links = {
		self: `${url(req)}/api/auctions?page[number]=${number}&page[size]=${size}`,
		first: `${url(req)}/api/auctions?page[number]=1&page[size]=${size}`,
		prev: number - 1 < 1 ? null : `${url(req)}/api/auctions?page[number]=${number - 1}&page[size]=${size}`,
		next: number + 1 > totalPages ? null : `${url(req)}/api/auctions?page[number]=${number + 1}&page[size]=${size}`,
		last: `${url(req)}/api/auctions?page[number]=${totalPages}&page[size]=${size}`
	}

	if (userId) for (key of Object.keys(links)) {
		if (links[key]) links[key] += `&user=${userId}`
	}

	return auctionSerialize(await Auction.find(match).sort('-endDate').populate('car').skip(size * (number - 1)).limit(size), links, { 'total': totalPages })
})

exports.search = defaultResponse(async req => {
	const { userId, page } = req.query
	const searchQuery = { name: { $regex: new RegExp(req.body.search, 'i') } }
	const match = userId ? { $and: [{ user: userId }, searchQuery] } : searchQuery
	const number = +page.number
	const size = +page.size

	const totalPages = Math.ceil(await Auction.countDocuments(match) / size)

	const links = {
		self: `${url(req)}/api/auctions?page[number]=${number}&page[size]=${size}`,
		first: `${url(req)}/api/auctions?page[number]=1&page[size]=${size}`,
		prev: number - 1 < 1 ? null : `${url(req)}/api/auctions?page[number]=${number - 1}&page[size]=${size}`,
		next: number + 1 > totalPages ? null : `${url(req)}/api/auctions?page[number]=${number + 1}&page[size]=${size}`,
		last: `${url(req)}/api/auctions?page[number]=${totalPages}&page[size]=${size}`
	}

	return auctionSerialize(await Auction.find(match)
		.sort('-endDate')
		.populate('car')
		.skip(size * (number - 1))
		.limit(size)
		.exec(), links, { 'total': totalPages })
})

exports.add = defaultResponse(async req => {
	const body = setBody(req)
	
	if (req.file) {
		body.image = `http://localhost:8008/${req.file.path}`
	}

	const result = await auctionValidate(body)
	return !result.length ? new Auction(body).save().then(data => auctionSerialize(data)) : result
})

exports.update = defaultResponse(async req => {
	const body = setBody(req)

	if (req.file) {
		body.image = `http://localhost:8008/${req.file.path}`
	}

	const result = await auctionValidate(body)
	return !result.length ? Auction.findByIdAndUpdate(req.params.id, body, {new: true}).then(data => auctionSerialize(data)) : result
})

exports.delete = defaultResponse(req => Auction.findByIdAndDelete(req.params.id))

function setBody(req) {
	const { data } = req.body
	const { relationships: { car, user} } = data
	
	data.attributes.endDate = data.attributes['end-date']
	
	return { ...data.attributes, car: car.data.id, user: user.data.id }
}	
