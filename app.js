const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors('*'))

app.get('/', (req, res) => res.status(200).json('siemanko'))

return app.listen(8007, () => {
    console.log('Server is running on port: 8007');
})