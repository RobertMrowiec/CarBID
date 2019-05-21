const express = require('express')
const router = express.Router()
const cars = require('./details')

router.get('/', cars.get)
	.get('/:id', cars.getById)
	.post('/', cars.add)
	.patch('/:id', cars.update)
	.delete('/:id', cars.delete)

module.exports = router