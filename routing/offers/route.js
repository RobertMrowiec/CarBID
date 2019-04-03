const express = require('express')
const router = express.Router()
const offers = require('./details')

router.get('/', offers.get)
    .get('/:id', offers.getById)
    .get('/page/:page/limit/:limit', offers.pagination)
    .post('/', offers.add)
    .put('/:id', offers.update)
    .delete('/:id', offers.delete)

module.exports = router