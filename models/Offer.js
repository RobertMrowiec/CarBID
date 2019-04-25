const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OfferSchema = new Schema({
	auction: { type: Schema.Types.ObjectId, ref: 'Auction'},
	user: { type: Schema.Types.ObjectId, ref: 'User' },
	price: { type: Number, required: true }
})

module.exports = mongoose.model('Offer', OfferSchema)