const JSONAPISerializer = require('jsonapi-serializer').Serializer;

function auctionSerialize(data, topLevelLinks) {
  return new JSONAPISerializer('auctions', {
      attributes: ['name', 'description', 'image', 'car', 'createdAt', 'endDate', 'updatedAt', 'minimalPrice', 'offers'],
      topLevelLinks
  }).serialize(data)
}

module.exports.auctionSerialize = auctionSerialize