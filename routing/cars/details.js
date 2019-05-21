const Car = require('../../models/Car')
const { defaultResponse } = require('../common')
const { carValidate } = require('../../validation/car')
const { carSerialize } = require('../../serializers/cars')

exports.get = defaultResponse(() => Car.find().limit(3))

exports.getById = defaultResponse(req => Car.findById(req.params.id).then(car => carSerialize(car)))

exports.pagination = defaultResponse(req => {
	const { limit } = +req.params
	return Car.find().skip(limit * (req.params.page - 1)).limit(limit)
})

exports.add = defaultResponse(async req => {
	const { body } = req
	_setBody(body)
	const result = await carValidate(body)
	return !result.length ? new Car(body).save().then(data => carSerialize(data)) : result
})

exports.update = defaultResponse(async req => {
	const { body } = req
	_setBody(body)
	const result = await carValidate(body)
	return !result.length ? Car.findByIdAndUpdate(req.params.id, body, {new: true}).then(data => carSerialize(data)) : result
})

exports.delete = defaultResponse(req => Car.findByIdAndDelete(req.params.id))

function _setBody(body) {
	body = body.data.attributes
	body.horsePower = +body['horse-power']
	body.maxTorque = +body['max-torque']
	body.assembledAt = new Date(body['assembled-at']).toISOString().substr(0,10)
}