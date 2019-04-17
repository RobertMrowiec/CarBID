function defaultResponse(func) {
    return (req, res) => func(req, res)
        .then(result => res.status(200).json(result))
        .catch(err => {
            if (err instanceof Error || err instanceof TypeError) {
                console.log(err)
                err = err.message
            }
            res.status(400).json({ message: err })
        })
}
module.exports.defaultResponse = defaultResponse

module.exports.url = (req) => `${req.protocol}://${req.get('host')}`