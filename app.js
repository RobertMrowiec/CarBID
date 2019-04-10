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
app.use('/login', require('./routing/login/route'))

return mongoose.connect('mongodb://localhost/carbid', { useNewUrlParser: true }).then(() => {
    return app.listen(8007, () => console.log('Server is running on port: 8007'))
})