const mongoose = require('mongoose')

const CarSchema = new Mongoose.Schema({
    assembledAt: { type: Date, default: Date.now() },
    brand: { type: String, required: true },
    horsePower: Number,
    maxTorque: Number,
    model: { type: String, required: true }
})

module.exports = mongoose.model('Car', CarSchema)