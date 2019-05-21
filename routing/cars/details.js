const Car = require('../../models/Car')
const { defaultResponse } = require('../common')
const { carValidate } = require('../../validation/car')
const { carSerialize } = require('../../serializers/cars')

exports.get = defaultResponse(() => Car.find().limit(3))

exports.getById = defaultResponse(req => Car.findById(req.params.id).then(car => carSerialize(car)))

exports.pagination = defaultResponse(req => {
	const limit = Number(req.params.limit)
	return Car.find().skip(limit * (req.params.page - 1)).limit(limit)
})

exports.add = defaultResponse(async req => {
	_setBody(req)
	const result = await carValidate(req.body)
	return !result.length ? new Car(req.body).save().then(data => carSerialize(data)) : result
})

exports.update = defaultResponse(async req => {
	_setBody(req)

	const result = await carValidate(req.body)
	return !result.length ? Car.findByIdAndUpdate(req.params.id, req.body, {new: true}).then(data => carSerialize(data)) : result
})

exports.delete = defaultResponse(req => Car.findByIdAndDelete(req.params.id))

function _setBody(req) {
	req.body = req.body.data.attributes
	req.body.horsePower = +req.body['horse-power']
	req.body.maxTorque = +req.body['max-torque']
	req.body.assembledAt = new Date(req.body['assembled-at']).toISOString().substr(0,10)
}