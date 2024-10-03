const express = require('express')
const tradersRoutes = require('./trade/trade.routes')

const rootRoutes = express.Router()

rootRoutes.use('/service/data', tradersRoutes)

module.exports = rootRoutes
