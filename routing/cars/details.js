const Car = require('../../models/Car')
const { defaultResponse } = require('../common')
const { carValidate } = require('../../validation/car')
const { carSerialize } = require('../../serializers/cars')

exports.get = defaultResponse(() => Car.find().limit(3))

exports.getById = defaultResponse(req => Car.findById(req.params.id).then(car => carSerialize(car)))

exports.add = defaultResponse(async req => {
	let { body } = req
	const { result, parsedBody } = await _setBody(body)

	return !result.length ? new Car(parsedBody).save().then(data => carSerialize(data)) : result
})

exports.update = defaultResponse(async req => {
	const { body, params: { id } } = req
	const { result, parsedBody } = await _setBody(body)

	return !result.length ? Car.findByIdAndUpdate(id, parsedBody, { new: true }).then(data => carSerialize(data)) : result
})

exports.delete = defaultResponse(req => Car.findByIdAndDelete(req.params.id))

function _setBody(body) {
	body = body.data.attributes
	body.horsePower = +body['horse-power']
	body.maxTorque = +body['max-torque']
	body.assembledAt = new Date(body['assembled-at']).toISOString().substr(0,10)

	return carValidate(body)
}