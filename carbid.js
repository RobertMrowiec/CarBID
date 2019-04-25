const app = require('./app')
const mongoose = require('mongoose')

mongoose.connect(
	process.env.MONGODB_URI || 'mongodb://localhost/carbid',
	{ useNewUrlParser: true }
).then(() => {
	console.log('Server is running on port: 8007')
	app.listen(process.env.PORT || 8007)
})