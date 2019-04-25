const express = require('express')
const router = express.Router()
const cars = require('./details')

router.get('/', cars.get)
	.get('/:id', cars.getById)
	.get('/page/:page/limit/:limit', cars.pagination)
	.post('/', cars.add)
	.put('/:id', cars.update)
	.delete('/:id', cars.delete)

module.exports = router