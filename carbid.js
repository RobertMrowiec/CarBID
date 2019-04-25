require('./app')().then(app => {
	console.log('Server is running on port: 8007')
	app.listen(process.env.PORT || 8007)
})