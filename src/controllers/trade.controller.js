const {
  getDataHoldServices,
  getBuyToTradeServices,
  getSellToTradeServices,
  getDataSignalServices,
} = require('../services/trade.service')
const { SuccessResponse } = require('../utils/success.response')

const getDataHoldController = async (req, res, next) => {
  new SuccessResponse({
    message: 'Get data successfully',
    metaData: await getDataHoldServices(),
  }).send(res)
}

const getDataBuyController = async (req, res, next) => {
  new SuccessResponse({
    message: 'Get data successfully',
    metaData: await getBuyToTradeServices(),
  }).send(res)
}

const getDataSellController = async (req, res, next) => {
  new SuccessResponse({
    message: 'Get data successfully',
    metaData: await getSellToTradeServices(),
  }).send(res)
}

const getDataSignalController = async (req, res, next) => {
  new SuccessResponse({
    message: 'Get data successfully',
    metaData: await getDataSignalServices(req.body),
  }).send(res)
}

module.exports = {
  getDataHoldController,
  getDataBuyController,
  getDataSellController,
  getDataSignalController
}
