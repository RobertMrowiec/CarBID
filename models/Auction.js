const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AuctionSchema = new Mongoose.Schema({
    car: { type: Schema.Types.ObjectId, ref: 'Cars', required: true},
    description: { type: String, required: true },
    endDate: Date,
    image: { type: String, required: true },
    minimalPrice: Number,
    name: { type: String, required: true },
    offers: [{type: Schema.Types.ObjectId, ref: 'Offers'}]
}, { timestamps: true })

module.exports = mongoose.model('Auction', AuctionSchema)