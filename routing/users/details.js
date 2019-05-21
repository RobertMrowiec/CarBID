const bcrypt = require('bcrypt')
const User = require('../../models/User')
const { defaultResponse } = require('../common')
const { userValidate } = require('../../validation/user')
const { userSerialize } = require('../../serializers/users')

exports.get = defaultResponse(() => User.find().populate('auctions').populate('car'))

exports.getById = defaultResponse(async req => userSerialize(await User.findById(req.params.id)))

exports.pagination = defaultResponse(req => {
	const { limit, page } = +req.params
	return User.find().skip(limit * (page - 1)).limit(limit)
})

exports.add = defaultResponse(async req => {
	const { body } = req.body
	const result = await userValidate(body)
	body.password = bcrypt.hashSync(body.password, 5)

	return !result.length ? new User(body).save() : result
})

exports.update = defaultResponse(async req => {
	req.body = req.body.data.attributes
	const { body } = req
	const { id } = req.params
	const user = await User.findById(id)
	const result = await userValidate(body)
	let { password } = body

	if (password && !bcrypt.compare(password, user.password)){
		password = bcrypt.hashSync(password, 5)
	}
	
	return !result.length ? User.findByIdAndUpdate(id, body, {new: true}) : result
})

exports.delete = defaultResponse(req => User.findByIdAndDelete(req.params.id))