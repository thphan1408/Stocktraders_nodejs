const express = require('express')
const {
  getAllTradeController,
  getDataBuyController,
  getDataSellController,
} = require('../../controllers/trade.controller')

const tradersRoutes = express.Router()

tradersRoutes.get('/getTotalTrader', getAllTradeController)
tradersRoutes.get('/databuy', getDataBuyController)
tradersRoutes.get('/datasell', getDataSellController)

module.exports = tradersRoutes
