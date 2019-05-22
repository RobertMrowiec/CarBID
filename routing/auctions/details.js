const Auction = require('../../models/Auction')
const { defaultResponse, url } = require('../common')
const { auctionValidate } = require('../../validation/auction')
const { auctionSerialize } = require('../../serializers/auctions')
exports.get = defaultResponse(() => Auction.find().populate('car').populate('offer').then(data => auctionSerialize(data)))

exports.getById = defaultResponse(async req => auctionSerialize( await Auction.findById(req.params.id).populate('car').populate('offer')))

exports.pagination = defaultResponse(async req => {
	const { userId, page: { size, number }, filter } = req.query
	const parsedSize = +size
	const parsedNumber = +number
	const match = userId ? { user: userId } : {}
	
	if (filter)	match.name = { $regex: new RegExp(filter, 'i') }

	const collectionLength = userId || filter ? Auction.countDocuments(match) : Auction.countDocuments()
	const totalPages = Math.ceil( await collectionLength / parsedSize)
	
	const links = {
		self: `${url(req)}/api/auctions?page[number]=${parsedNumber}&page[size]=${parsedSize}`,
		first: `${url(req)}/api/auctions?page[number]=1&page[size]=${parsedSize}`,
		prev: parsedNumber - 1 < 1 ? null : `${url(req)}/api/auctions?page[number]=${parsedNumber - 1}&page[size]=${parsedSize}`,
		next: parsedNumber + 1 > totalPages ? null : `${url(req)}/api/auctions?page[number]=${parsedNumber + 1}&page[size]=${parsedSize}`,
		last: `${url(req)}/api/auctions?page[number]=${totalPages}&page[size]=${parsedSize}`
	}


	if (userId) for (key of Object.keys(links)) {
		if (links[key]) links[key] += `&user=${userId}`
	}

	return auctionSerialize(await Auction.find(match).sort('-endDate').populate('car').skip(parsedSize * (parsedNumber - 1)).limit(parsedSize), links, { 'total': totalPages })
})

exports.add = defaultResponse(async req => {
	const { body, result} = await _prepareAuctionObject(req)
	return !result.length ? new Auction(body).save().then(data => auctionSerialize(data)) : result
})

exports.update = defaultResponse(async req => {
	const { params: { id } } = req
	const { body, result} = await _prepareAuctionObject(req)
	return !result.length ? Auction.findByIdAndUpdate(id, body, { new: true }).then(data => auctionSerialize(data)) : result
})

exports.delete = defaultResponse(req => Auction.findByIdAndDelete(req.params.id))

function _setBody(req) {
	const { data } = req.body
	const { relationships: { car, user} } = data
	
	data.attributes.endDate = data.attributes['end-date']
	
	const { attributes } = data
	return { ...attributes, car: car.data.id, user: user.data.id }
}	

function _prepareAuctionObject(req) {
	const body = _setBody(req)

	const { file } = req
	
	if (file)	body.image = `http://localhost:8008/${req.file.path}`

	return auctionValidate(body)
}