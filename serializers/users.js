const JSONAPISerializer = require('jsonapi-serializer').Serializer

function userSerialize(data, topLevelLinks, meta) {
	return new JSONAPISerializer('user', {
		attributes: ['email', 'password', 'name'],
		topLevelLinks,
		meta,
		auctions: [{
			ref: '_id',
			nullIdMissing: true
		}],
		offers: [{
			ref: '_id',
			nullIdMissing: true
		}],

	}).serialize(data)
}

module.exports.userSerialize = userSerialize