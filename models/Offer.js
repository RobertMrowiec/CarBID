const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OfferSchema = new Mongoose.Schema({
    auction: { type: Schema.Types.ObjectId, ref: 'Auctions'},
    user: { type: Schema.Types.ObjectId, ref: 'Users' },
    price: { type: Number, required: true }
})

module.exports = mongoose.model('Offer', OfferSchema)