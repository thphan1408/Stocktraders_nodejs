const HoldToTrade = require('../models/dataHold.model')
const BuyToTrade = require('../models/dataBuy.model')
const SellToTrade = require('../models/dataSell.model')
const SignalToTrade = require('../models/dataSignal.model')
const { callApi } = require('../utils/apiCaller')
const { _API_DATASELL, _API_DATA_BUY, _API_DATA_HOLD } = require('../constants/values.constants')
const { getLastFriday } = require('../utils/dateUtils')
const { checkPermission14, checkPermission15, checkPermission16, checkUserPermissions } = require('../auth/checkPermission')

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
const getDataHoldServices = async () => {
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
    const today = new Date();
    const dayOfWeek = today.getDay();

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

    const formattedDataHold = []

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

        if (newTradeData.ticker) {
          formattedDataHold.push(newTradeData)
        }
      })
    }

    if (dayOfWeek === 6 || dayOfWeek === 0) { // Thứ 7 hoặc Chủ nhật
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1); // Lấy ngày hôm qua
      const existingData = await HoldToTrade.findOne({ date: yesterday.toISOString().split('T')[0] });

      if (existingData) {
        // Nếu đã tồn tại dữ liệu của ngày hôm qua, cập nhật lại
        existingData.data = formattedDataHold;
        await existingData.save();
      } else {
        // Nếu chưa tồn tại, tạo mới
        const newData = new HoldToTrade({
          data: formattedDataHold,
          date: yesterday.toISOString().split('T')[0],
        });
        await newData.save();
      }

      return {
        data: formattedDataHold,
        date: yesterday.toISOString().split('T')[0], // Lưu ngày theo định dạng YYYY-MM-DD
      }
    } else {
      // Lưu dữ liệu mới vào MongoDB cho ngày hôm nay
      let finalData = {
        data: formattedDataHold,
        date: today.toISOString().split('T')[0], // Lưu ngày theo định dạng YYYY-MM-DD
      };

      const existingTodayData = await HoldToTrade.findOne({ date: today });

      if (existingTodayData) {
        // Nếu đã tồn tại dữ liệu của ngày hôm nay, cập nhật lại
        existingTodayData.data = formattedDataHold;
        await existingTodayData.save();
      } else {
        // Nếu chưa tồn tại, tạo mới
        const newTradeData = new HoldToTrade(finalData);
        await newTradeData.save();
      }
      return finalData;
    }
  } catch (error) {
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
  ];

  try {
    const today = new Date();
    const dayOfWeek = today.getDay();

    const [dataFromApi1, dataFromApi2] = await Promise.all(
      apiConfigs.map((config) => callApi(config))
    );

    const stockDataFromApi1 = dataFromApi1?.TotalTradeRealReply?.stockTotalReals;
    const stockDataBuyFromApi = dataFromApi2.data;

    // Tạo một đối tượng để lưu trữ vol theo ticker
    const volByTicker = {};

    // Xử lý dữ liệu từ API 1 để lấy vol
    if (Array.isArray(stockDataFromApi1)) {
      stockDataFromApi1.forEach((tradeItem) => {
        volByTicker[tradeItem.ticker] = tradeItem.vol;
      });
    }

    const formattedDataBuy = [];

    // Xử lý dữ liệu từ API 2
    if (Array.isArray(stockDataBuyFromApi)) {
      stockDataBuyFromApi.forEach((tradeItem) => {
        const newTradeData = {
          ticker: tradeItem.ticker || null,
          vol: volByTicker[tradeItem.ticker] || null,
          price: tradeItem.price || null,
          ave: tradeItem.ave || null,
          profit: tradeItem.profit || null,
          change: tradeItem.change || null,
          percent: tradeItem.percent || null,
        };

        if (newTradeData.ticker) {
          formattedDataBuy.push(newTradeData);
        }
      });
    }

    if (dayOfWeek === 6 || dayOfWeek === 0) { // Thứ 7 hoặc Chủ nhật
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1); // Lấy ngày hôm qua
      const existingData = await BuyToTrade.findOne({ date: yesterday.toISOString().split('T')[0] });

      if (existingData) {
        // Nếu đã tồn tại dữ liệu của ngày hôm qua, cập nhật lại
        existingData.data = formattedDataBuy;
        await existingData.save();
      } else {
        // Nếu chưa tồn tại, tạo mới
        const newData = new BuyToTrade({
          data: formattedDataBuy,
          date: yesterday.toISOString().split('T')[0],
        });
        await newData.save();
      }

      return {
        data: formattedDataBuy,
        date: yesterday.toISOString().split('T')[0], // Lưu ngày theo định dạng YYYY-MM-DD
      }
    } else {
      // Lưu dữ liệu mới vào MongoDB cho ngày hôm nay
      let finalData = {
        data: formattedDataBuy,
        date: today.toISOString().split('T')[0], // Lưu ngày theo định dạng YYYY-MM-DD
      };

      const existingTodayData = await BuyToTrade.findOne({ date: today });

      if (existingTodayData) {
        // Nếu đã tồn tại dữ liệu của ngày hôm nay, cập nhật lại
        existingTodayData.data = formattedDataBuy;
        await existingTodayData.save();
      } else {
        // Nếu chưa tồn tại, tạo mới
        const newTradeData = new BuyToTrade(finalData);
        await newTradeData.save();
      }
      return finalData;
    }
  } catch (error) {
    console.error('Lỗi khi gọi API hoặc lưu dữ liệu: ', error);
    throw error;
  }
};

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
    const today = new Date();
    const dayOfWeek = today.getDay();

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
        // Lưu trữ vol theo ticker
        volByTicker[tradeItem.ticker] = tradeItem.vol
      })
    }

    const formattedDataSell = []

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

        if (newTradeData.ticker) {
          formattedDataSell.push(newTradeData)
        }
      })
    }

    if (dayOfWeek === 6 || dayOfWeek === 0) { // Thứ 7 hoặc Chủ nhật
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1); // Lấy ngày hôm qua
      const existingData = await SellToTrade.findOne({ date: yesterday.toISOString().split('T')[0] });

      if (existingData) {
        // Nếu đã tồn tại dữ liệu của ngày hôm qua, cập nhật lại
        existingData.data = formattedDataSell;
        await existingData.save();
      } else {
        // Nếu chưa tồn tại, tạo mới
        const newData = new SellToTrade({
          data: formattedDataSell,
          date: yesterday.toISOString().split('T')[0],
        });
        await newData.save();
      }

      return {
        data: formattedDataSell,
        date: yesterday.toISOString().split('T')[0], // Lưu ngày theo định dạng YYYY-MM-DD
      }
    } else {
      // Lưu dữ liệu mới vào MongoDB cho ngày hôm nay
      let finalData = {
        data: formattedDataSell,
        date: today.toISOString().split('T')[0], // Lưu ngày theo định dạng YYYY-MM-DD
      };

      const existingTodayData = await SellToTrade.findOne({ date: today });

      if (existingTodayData) {
        // Nếu đã tồn tại dữ liệu của ngày hôm nay, cập nhật lại
        existingTodayData.data = formattedDataSell;
        await existingTodayData.save();
      } else {
        // Nếu chưa tồn tại, tạo mới
        const newTradeData = new SellToTrade(finalData);
        await newTradeData.save();
      }
      return finalData;
    }
  } catch (error) {
    throw error;
  }
}

const getDataSignalServices = async (body) => {
  const { StocktradersRightsRequest } = body
  const { account, user } = StocktradersRightsRequest

  const apiBody = {
    StocktradersRightsRequest: {
      account: account,
      user: user,
    },
  }

  const apiConfigs = [
    {
      url: _API_DATASELL,
      signal: 'datasell',
      checkPermission: checkPermission14, // Sử dụng hàm kiểm tra quyền tương ứng
    },
    {
      url: _API_DATA_BUY,
      signal: 'databuy',
      checkPermission: checkPermission15, // Sử dụng hàm kiểm tra quyền tương ứng
    },
    {
      url: _API_DATA_HOLD,
      signal: 'datahold',
      checkPermission: checkPermission16, // Sử dụng hàm kiểm tra quyền tương ứng
    },
  ];

  try {

    // Gọi các API mà user có quyền truy cập hoặc trả về mảng rỗng nếu không có quyền
    const responses = await Promise.all(apiConfigs.map(async (config) => {
      // Kiểm tra quyền trước khi gọi API
      const hasPermission = await config.checkPermission(user);

      // Nếu không có quyền thì trả về null để không gọi API và lưu vào DB và trả về lỗi
      // Nếu không có quyền, trả về mã lỗi và thông báo cho API đó
      if (hasPermission !== 1) {
        return {
          code: 403,
          message: `You do not have permission to access the ${config.signal} resource.`,
          signal: config.signal,
        };
      }

      // Nếu có quyền thì gọi API và gắn thêm signal vào mỗi response
      const data = await callApi({
        url: config.url.url,
        method: 'POST',
        body: apiBody,
        headers: {
          'Content-Type': 'application/json',
        },
        source: config.signal,
      });

      return { data: data, signal: config.signal };
    }));

    const currentDate = new Date();
    let saveDate;

    // Kiểm tra nếu là cuối tuần (thứ Bảy hoặc Chủ Nhật)
    if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
      // Nếu là thứ Bảy hoặc Chủ Nhật, lấy ngày thứ Sáu gần nhất
      const lastFriday = getLastFriday(currentDate);
      saveDate = lastFriday; // Lưu ngày dưới dạng YYYY-MM-DD
    } else {
      // Nếu không phải cuối tuần, lưu ngày hiện tại
      saveDate = currentDate.toISOString().split('T')[0];
    }

    // Lưu dữ liệu vào MongoDB cho những API có quyền truy cập
    const saveDataPromises = responses.map(async (response) => {
      // Nếu response có mã lỗi, không lưu vào DB
      if (response.code === 403) {
        return response; // Trả về lỗi, không lưu
      }

      // Điều kiện để kiểm tra tài liệu đã tồn tại chưa
      const query = { signal: response.signal, date: saveDate };

      // Dữ liệu để cập nhật hoặc tạo mới
      const update = {
        signal: response.signal,
        data: response.data.metaData,
        date: saveDate,
      };

      // Tùy chọn để tạo mới tài liệu nếu không tồn tại
      const options = { upsert: true, new: true };

      // Cập nhật hoặc tạo mới tài liệu trong MongoDB
      await SignalToTrade.findOneAndUpdate(query, update, options);

      return response; // Trả về response thành công
    });

    // Đợi tất cả các promise xử lý dữ liệu hoàn thành
    const finalResults = await Promise.all(saveDataPromises);

    return finalResults; // Trả về kết quả cho client
  } catch (error) {
    throw error
  }

}

module.exports = {
  getDataHoldServices,
  getBuyToTradeServices,
  getSellToTradeServices,
  getDataSignalServices,
}
