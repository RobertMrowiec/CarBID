const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AuctionSchema = new Schema({
	car: { type: Schema.Types.ObjectId, ref: 'Car', required: true},
	description: { type: String, required: true },
	endDate: Date,
	image: { type: String, required: true },
	minimalPrice: Number,
	name: { type: String, required: true },
	offers: [{type: Schema.Types.ObjectId, ref: 'Offer'}]
}, { timestamps: true })

module.exports = mongoose.model('Auction', AuctionSchema)