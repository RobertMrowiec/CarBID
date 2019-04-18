const express = require('express')
const router = express.Router()
const users = require('./details')

router.get('/', users.get)
    .get('/:id', users.getById)
    .get('/page/:page/limit/:limit', users.pagination)
    .post('/', users.add)
    .patch('/:id', users.update)
    .delete('/:id', users.delete)

module.exports = router