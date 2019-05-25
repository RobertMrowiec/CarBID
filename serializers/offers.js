const JSONAPISerializer = require('jsonapi-serializer').Serializer

function offerSerialize(data, topLevelLinks, meta) {
	return new JSONAPISerializer('offers', {
		attributes: ['price'],
		topLevelLinks,
		meta,
		auction: {
			ref: '_id',
			nullIdMissing: true
		},
		user: {
			ref: '_id',
			nullIdMissing: true
		}
	}).serialize(data)
}

module.exports.offerSerialize = offerSerialize