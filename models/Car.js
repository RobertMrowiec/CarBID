const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CarSchema = new Schema({
    assembledAt: { type: Date, default: Date.now() },
    brand: { type: String, required: true },
    horsePower: Number,
    maxTorque: Number,
    model: { type: String, required: true }
})

module.exports = mongoose.model('Car', CarSchema)