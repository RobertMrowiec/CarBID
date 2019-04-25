const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	auctions: [{ type: Schema.Types.ObjectId, ref: 'Auction'}],
	offers: [{ type: Schema.Types.ObjectId, ref: 'Offer'}]
}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema)