const express = require('express')
const router = express.Router()
const images = require('./details')
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
  
router.post('/', upload.single('file'), images.add)

module.exports = router