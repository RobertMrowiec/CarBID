const JSONAPISerializer = require('jsonapi-serializer').Serializer;

function defaultResponse(func) {
    return (req, res) => func(req, res)
        .then(result => res.status(200).json(result))
        .catch(err => res.status(400).json(err))
}
module.exports.defaultResponse = defaultResponse

function auctionSerialize(data) {
    return new JSONAPISerializer('auctions', {
        attributes: ['name', 'description', 'image', 'car', 'createdAt', 'endDate', 'updatedAt', 'minimalPrice', 'offers']
    }).serialize(data)
}
module.exports.auctionSerialize = auctionSerialize