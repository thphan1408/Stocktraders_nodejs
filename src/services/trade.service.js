const Trade = require('../models/tradeReal.model')
const BuyToTrade = require('../models/dataBuy.model')
const SellToTrade = require('../models/dataSell.model')
const { callApi } = require('../utils/apiCaller')

const _GET_ALL_TRADE = {
  url: 'https://stocktraders.vn/service/data/getTotalTradeReal',
  method: 'POST',
  body: {
    TotalTradeRealRequest: {
      account: 'StockTraders',
    },
  },
  headers: {
    'Content-Type': 'application/json',
  },
  source: 'TotalTradeReal',
}

// Hàm xử lý dữ liệu và lưu vào MongoDB
const getAllTradeServices = async () => {
  const apiConfigs = [
    _GET_ALL_TRADE,
    {
      url: 'https://stocktraders.vn/service/data/datahold',
      method: 'POST',
      body: {
        DataRequest: {
          account: 'StockTraders',
        },
      },
      headers: {
        'Content-Type': 'application/json',
      },
      source: 'DataHold',
    },
  ]

  try {
    const [dataFromApi1, dataFromApi2] = await Promise.all(
      apiConfigs.map((config) => callApi(config)),
    )

    const stockDataFromApi1 = dataFromApi1?.TotalTradeRealReply?.stockTotalReals
    const stockDataFromApi2 = dataFromApi2.data

    // Tạo một đối tượng để lưu trữ vol theo ticker
    const volByTicker = {}

    // Xử lý dữ liệu từ API 1 để lấy vol
    if (Array.isArray(stockDataFromApi1)) {
      stockDataFromApi1.forEach((tradeItem) => {
        // Lưu trữ vol theo ticker
        volByTicker[tradeItem.ticker] = tradeItem.vol
      })
    }

    // Xử lý dữ liệu từ API 2
    if (Array.isArray(stockDataFromApi2)) {
      stockDataFromApi2.forEach(async (tradeItem) => {
        // Kiểm tra và lấy các trường cần thiết từ API 2
        const newTradeData = {
          ave: tradeItem.ave || null,
          profit: tradeItem.profit || null,
          change: tradeItem.change || null,
          percent: tradeItem.percent || null,
          price: tradeItem.price || null,
          ticker: tradeItem.ticker || null,
          // Lấy vol từ đối tượng volByTicker nếu ticker tồn tại
          vol: volByTicker[tradeItem.ticker] || null,
        }

        // Kiểm tra xem vol có giá trị hợp lệ không
        if (newTradeData.vol === null) {
          // console.warn(
          //   `Skipping ${tradeItem.ticker}: vol is required but is null`,
          // )
          return // Không tạo tài liệu mới nếu vol là null
        }

        // Tìm kiếm tài liệu trong MongoDB để cập nhật
        const existingTrade = await Trade.findOne({ ticker: tradeItem.ticker })

        if (existingTrade) {
          // Cập nhật thông tin từ API 2 vào tài liệu
          Object.assign(existingTrade, newTradeData)
          await existingTrade.save()
          // console.log(
          //   `Updated Trade from API2 for ${tradeItem.ticker}:`,
          //   existingTrade,
          // )
        } else {
          // Nếu không tồn tại, tạo mới
          const newTrade = new Trade({
            ticker: tradeItem.ticker,
            ...newTradeData,
          })
          await newTrade.save()
          // console.log(`Created new Trade for ${tradeItem.ticker}:`, newTrade)
        }
      })
    }

    const metaData = await Trade.find()

    return {
      metaData,
    }
  } catch (error) {
    // console.error('Error in fetching data:', error)
    throw error
  }
}

const getBuyToTradeServices = async () => {
  const apiConfigs = [
    _GET_ALL_TRADE,
    {
      url: 'https://stocktraders.vn/service/data/databuy',
      method: 'POST',
      body: {
        DataRequest: {
          account: 'StockTraders',
        },
      },
      headers: {
        'Content-Type': 'application/json',
      },
      source: 'DataBuy',
    },
  ]

  try {
    const [dataFromApi1, dataFromApi2] = await Promise.all(
      apiConfigs.map((config) => callApi(config)),
    )

    const stockDataFromApi1 = dataFromApi1?.TotalTradeRealReply?.stockTotalReals
    const stockDataBuyFromApi = dataFromApi2.data

    // Tạo một đối tượng để lưu trữ vol theo ticker
    const volByTicker = {}

    // Xử lý dữ liệu từ API 1 để lấy vol
    if (Array.isArray(stockDataFromApi1)) {
      stockDataFromApi1.forEach((tradeItem) => {
        // Lưu trữ vol theo ticker
        volByTicker[tradeItem.ticker] = tradeItem.vol
      })
    }

    // Xử lý dữ liệu từ API 2
    if (Array.isArray(stockDataBuyFromApi)) {
      stockDataBuyFromApi.forEach(async (tradeItem) => {
        // Kiểm tra và lấy các trường cần thiết từ API 2
        const newTradeData = {
          ticker: tradeItem.ticker || null,
          // Lấy vol từ đối tượng volByTicker nếu ticker tồn tại
          vol: volByTicker[tradeItem.ticker] || null,
          price: tradeItem.price || null,
          ave: tradeItem.ave || null,
          profit: tradeItem.profit || null,
          change: tradeItem.change || null,
          percent: tradeItem.percent || null,
        }

        // Kiểm tra xem vol có giá trị hợp lệ không
        if (newTradeData.vol === null) {
          // console.warn(
          //   `Skipping ${tradeItem.ticker}: vol is required but is null`,
          // )
          return // Không tạo tài liệu mới nếu vol là null
        }

        // Tìm kiếm tài liệu trong MongoDB để cập nhật
        const existingTrade = await BuyToTrade.findOne({
          ticker: tradeItem.ticker,
        })

        if (existingTrade) {
          // Cập nhật thông tin từ API 2 vào tài liệu
          Object.assign(existingTrade, newTradeData)
          await existingTrade.save()
          // console.log(
          //   `Updated Trade from API2 for ${tradeItem.ticker}:`,
          //   existingTrade,
          // )
        } else {
          // Nếu không tồn tại, tạo mới
          const newTrade = new BuyToTrade({
            ticker: tradeItem.ticker,
            ...newTradeData,
          })
          await newTrade.save()
          // console.log(`Created new Trade for ${tradeItem.ticker}:`, newTrade)
        }
      })
    }
    const metaData = await BuyToTrade.find()

    return {
      metaData,
    }
  } catch (error) {
    console.error('Error in fetching data:', error)
  }
}

const getSellToTradeServices = async () => {
  const apiConfigs = [
    _GET_ALL_TRADE,
    {
      url: 'https://stocktraders.vn/service/data/datasell',
      method: 'POST',
      body: {
        DataRequest: {
          account: 'StockTraders',
        },
      },
      headers: {
        'Content-Type': 'application/json',
      },
      source: 'DataSell',
    },
  ]

  try {
    const [dataFromApi1, dataFromApi2] = await Promise.all(
      apiConfigs.map((config) => callApi(config)),
    )

    const stockDataFromApi1 = dataFromApi1?.TotalTradeRealReply?.stockTotalReals
    const stockDataSellFromApi = dataFromApi2.data

    // Tạo một đối tượng để lưu trữ vol theo ticker
    const volByTicker = {}

    // Xử lý dữ liệu từ API 1 để lấy vol
    if (Array.isArray(stockDataFromApi1)) {
      stockDataFromApi1.forEach((tradeItem) => {
        // console.log(`tradeItem 1:: `, tradeItem)
        // Lưu trữ vol theo ticker
        volByTicker[tradeItem.ticker] = tradeItem.vol
      })
    }

    // Xử lý dữ liệu từ API 2
    if (Array.isArray(stockDataSellFromApi)) {
      stockDataSellFromApi.forEach(async (tradeItem) => {
        // Kiểm tra và lấy các trường cần thiết từ API 2
        const newTradeData = {
          ticker: tradeItem.ticker || null,
          // Lấy vol từ đối tượng volByTicker nếu ticker tồn tại
          vol: volByTicker[tradeItem.ticker] || null,
          price: tradeItem.price || null,
          ave: tradeItem.ave || null,
          profit: tradeItem.profit || null,
          change: tradeItem.change || null,
          percent: tradeItem.percent || null,
        }

        // Kiểm tra xem vol có giá trị hợp lệ không
        if (newTradeData.vol === null) {
          // console.warn(
          //   `Skipping ${tradeItem.ticker}: vol is required but is null`,
          // )
          return // Không tạo tài liệu mới nếu vol là null
        }

        // Tìm kiếm tài liệu trong MongoDB để cập nhật
        const existingTrade = await SellToTrade.findOne({
          ticker: tradeItem.ticker,
        })

        if (existingTrade) {
          // Cập nhật thông tin từ API 2 vào tài liệu
          Object.assign(existingTrade, newTradeData)
          await existingTrade.save()
          console.log(
            // `Updated Trade from API2 for ${tradeItem.ticker}:`,
            existingTrade,
          )
        } else {
          // Nếu không tồn tại, tạo mới
          const newTrade = new SellToTrade({
            ticker: tradeItem.ticker,
            ...newTradeData,
          })
          await newTrade.save()
          // console.log(`Created new Trade for ${tradeItem.ticker}:`, newTrade)
        }
      })
    }
    const metaData = await SellToTrade.find()

    return {
      metaData,
    }
  } catch (error) {
    console.error('Error in fetching data:', error)
  }
}

module.exports = {
  getAllTradeServices,
  getBuyToTradeServices,
  getSellToTradeServices,
}
