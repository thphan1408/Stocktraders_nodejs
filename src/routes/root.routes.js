const express = require('express')
const tradersRoutes = require('./trade/trade.routes')

const rootRoutes = express.Router()

rootRoutes.use('/data', tradersRoutes)

module.exports = rootRoutes
