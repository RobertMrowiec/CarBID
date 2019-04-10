const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { defaultResponse } = require('../common')
const User = require('../../models/User')

exports.login = defaultResponse(async req => {
	const user = await User.findOne({email: req.body.email})
	if (user && bcrypt.compare(req.body.password, user.password)) {
		return {
			token: jwt.sign({ user }, process.env.privateKey, { expiresIn: 60 * 60 }),
			user
		}
	}
	throw new Error('Wrong credentials')
})