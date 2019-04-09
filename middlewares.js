const jwt = require('jsonwebtoken')

const _MethodNotUserPost = req =>  (req.url !== '/api/users' && req.method === 'POST')

module.exports.auth = (req, res, next) => {
	if (req.url.startsWith('/api') && _MethodNotUserPost(req)) {
		if (req.headers.authorization) {
			let token = req.headers.authorization.split(' ')[1]
			jwt.verify(token, process.env.privateKey, (err, decoded) => {
				err ? res.status(403).json("Authorization failed") : next()
			})
		} else {
			return res.status(403).json("Authorization failed")
		}
	} else next()
}