exports.add = (req, res) => res.status(200).json(`http://localhost:8008/${req.file.path}`)