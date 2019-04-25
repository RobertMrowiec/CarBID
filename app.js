const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const { auth } = require('./middlewares')
const app = express()

dotenv.config()

app.use(cors('*'))
app.use(bodyParser.json())

app.use((req, res, next) => auth(req, res, next))

app.use('/api/users', require('./routing/users/route'))
app.use('/api/cars', require('./routing/cars/route'))
app.use('/api/auctions', require('./routing/auctions/route'))
app.use('/api/offers', require('./routing/offers/route'))
app.use('/api/images', require('./routing/images/route'))
app.use('/login', require('./routing/login/route'))

module.exports = (mongodbURL) => {
	return mongoose.connect(
		process.env.MONGODB_URI || mongodbURL,
		{ useNewUrlParser: true }
	).then(() => app)
}