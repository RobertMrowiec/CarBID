const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    auctions: [{ type: Schema.Types.ObjectId, ref: 'Auctions'}],
    auctions: [{ type: Schema.Types.ObjectId, ref: 'Auctions'}],
}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema)