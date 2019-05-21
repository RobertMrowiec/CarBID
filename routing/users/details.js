const bcrypt = require('bcrypt')
const User = require('../../models/User')
const { defaultResponse } = require('../common')
const { userValidate } = require('../../validation/user')
const { userSerialize } = require('../../serializers/users')

exports.get = defaultResponse(() => User.find().populate('auctions').populate('car'))

exports.getById = defaultResponse(async req => userSerialize(await User.findById(req.params.id)))

exports.pagination = defaultResponse(req => {
	const { limit } = +req.params
	return User.find().skip(limit * (req.params.page - 1)).limit(limit)
})

exports.add = defaultResponse(async req => {
	const result = await userValidate(req.body)
	req.body.password = bcrypt.hashSync(req.body.password, 5)

	return !result.length ? new User(req.body).save() : result
})

exports.update = defaultResponse(async req => {
	req.body = req.body.data.attributes
	const user = await User.findById(req.params.id)
	const result = await userValidate(req.body)
	let { password } = req.body

	if (password && !bcrypt.compare(password, user.password)){
		password = bcrypt.hashSync(password, 5)
	}
	
	return !result.length ? User.findByIdAndUpdate(req.params.id, req.body, {new: true}) : result
})

exports.delete = defaultResponse(req => User.findByIdAndDelete(req.params.id))