const express = require('express')
const router = express.Router()
const taskDetails = require('./details')

router.get('/', taskDetails.get)
    .get('/:id', taskDetails.getById)
    .get('/page/:page/limit/:limit', taskDetails.pagination)
    .post('/', taskDetails.add)
    .put('/:id', taskDetails.update)
    .delete('/:id', taskDetails.delete)

module.exports = router