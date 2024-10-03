const express = require('express')
const {
  getAllTradeController,
  getDataBuyController,
  getDataSellController,
} = require('../../controllers/trade.controller')
const {
  checkUserRights14,
  checkUserRights15,
  checkUserRights16,
} = require('../../middlewares/checkPermission.middleware')

const tradersRoutes = express.Router()

// tradersRoutes.use(checkUserRights)
tradersRoutes.post('/databuy', checkUserRights14, getDataBuyController)
tradersRoutes.post('/datasell', checkUserRights15, getDataSellController)
tradersRoutes.post('/datahold', checkUserRights16, getAllTradeController)

module.exports = tradersRoutes
