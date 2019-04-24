const User = require('../models/User')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

module.exports.generateToken = async () => {
	const user = await new User({email: 'token@herecars.com', password: 'qwe123', name: 'token'}).save()
	return jwt.sign({user: user._id}, process.env.privateKey)
}