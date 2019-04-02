const express = require('express')
const router = express.Router()
const auctions = require('./details')

router.get('/', auctions.get)
    .get('/:id', auctions.getById)
    .get('/page/:page/limit/:limit', auctions.pagination)
    .post('/', auctions.add)
    .put('/:id', auctions.update)
    .delete('/:id', auctions.delete)

module.exports = router