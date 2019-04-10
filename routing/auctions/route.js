const express = require('express')
const router = express.Router()
const auctions = require('./details')

router.get('/', auctions.pagination)
    .get('/:id', auctions.getById)
    .post('/', auctions.add)
    .put('/:id', auctions.update)
    .delete('/:id', auctions.delete)

module.exports = router