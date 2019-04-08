const Auction = require('../../models/Auction')
const { defaultResponse } = require('../common')
const { auctionValidate } = require('../../validation/auction')
const { auctionSerialize } = require('../common')

exports.get = defaultResponse(() => Auction.find().populate('car').populate('offer').then(data => auctionSerialize(data)))

exports.getById = defaultResponse(req => Auction.findById(req.params.id).populate('car').populate('offer'))

exports.pagination = defaultResponse(req => {
    const limit = Number(req.params.limit)
    return Auction.find().skip(limit * (req.params.page - 1)).limit(limit)
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