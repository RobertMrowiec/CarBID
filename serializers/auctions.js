const JSONAPISerializer = require('jsonapi-serializer').Serializer

function auctionSerialize(data, topLevelLinks, meta) {
	return new JSONAPISerializer('auctions', {
		attributes: ['name', 'description', 'image', 'car', 'createdAt', 'endDate', 'updatedAt', 'minimalPrice', 'offers', 'user'],
		topLevelLinks,
		meta,
		car: {
			ref: '_id',
			nullIdMissing: true
		},
		user: {
			ref: '_id',
			nullIdMissing: true
		}
	}).serialize(data)
}

module.exports.auctionSerialize = auctionSerialize