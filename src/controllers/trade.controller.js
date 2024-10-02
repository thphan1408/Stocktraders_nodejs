const {
  getAllTradeServices,
  getBuyToTradeServices,
  getSellToTradeServices,
} = require('../services/trade.service')
const { SuccessResponse } = require('../utils/success.response')

const getAllTradeController = async (req, res, next) => {
  new SuccessResponse({
    message: 'Data saved to database',
    metaData: await getAllTradeServices(),
  }).send(res)
}

const getDataBuyController = async (req, res, next) => {
  new SuccessResponse({
    message: 'Data saved to database',
    metaData: await getBuyToTradeServices(),
  }).send(res)
}

const getDataSellController = async (req, res, next) => {
  new SuccessResponse({
    message: 'Data saved to database',
    metaData: await getSellToTradeServices(),
  }).send(res)
}

module.exports = {
  getAllTradeController,
  getDataBuyController,
  getDataSellController,
}
