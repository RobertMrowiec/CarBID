const Car = require('../../models/Car')
const { defaultResponse } = require('../common')
const { carValidate } = require('../../validation/car')
const { carSerialize } = require('../../serializers/cars')

exports.get = defaultResponse(() => Car.find().limit(3).then(cars => carSerialize(cars)))

exports.getById = defaultResponse(req => Car.findById(req.params.id).then(car => carSerialize(car)))

exports.pagination = defaultResponse(req => {
    const limit = Number(req.params.limit)
    return Car.find().skip(limit * (req.params.page - 1)).limit(limit)
})

exports.add = defaultResponse(async req => {
    const result = await carValidate(req.body)
    return !result.length ? new Car(req.body).save() : result
})

exports.update = defaultResponse(async req => {
    const result = await carValidate(req.body)
    return !result.length ? Car.findByIdAndUpdate(req.params.id, req.body, {new: true}) : result
})

exports.delete = defaultResponse(req => Car.findByIdAndDelete(req.params.id))