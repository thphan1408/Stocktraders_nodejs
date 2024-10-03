const {
  getAllTradeServices,
  getBuyToTradeServices,
  getSellToTradeServices,
} = require('../services/trade.service')
const { SuccessResponse } = require('../utils/success.response')

const getAllTradeController = async (req, res, next) => {
  new SuccessResponse({
    message: 'Get data successfully',
    metaData: await getAllTradeServices(req.body),
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

module.exports = {
  getAllTradeController,
  getDataBuyController,
  getDataSellController,
}
