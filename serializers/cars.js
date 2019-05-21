const JSONAPISerializer = require('jsonapi-serializer').Serializer

function carSerialize(data, topLevelLinks, meta) {
	return new JSONAPISerializer('car', {
		attributes: ['brand', 'model', 'maxTorque', 'horsePower', 'assembledAt'],
		topLevelLinks,
		meta
	}).serialize(data)
}

module.exports.carSerialize = carSerialize