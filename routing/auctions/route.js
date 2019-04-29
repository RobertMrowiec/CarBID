const express = require('express')
const router = express.Router()
const auctions = require('./details')
const multer  = require('multer')

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/')
	},
	filename: function (req, file, cb) {
		cb(null, `file-${Date.now()}.${file.originalname.split('.')[1]}`)
	}
})
const upload = multer({ storage: storage })
  
router.get('/', auctions.pagination)
	.get('/:id', auctions.getById)
	.post('/', upload.single('image'), auctions.add)
	.patch('/:id', auctions.update)
	.delete('/:id', auctions.delete)

module.exports = router