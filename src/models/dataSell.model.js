'use strict'

const { model, Schema } = require('mongoose')

const DOCUMENT_NAME = 'DataSell'
const COLLECTION_NAME = 'dataSells'

// ticker, vol, price, ave, profit, change, percent

// Declare the Schema of the Mongo model
var dataSellSchema = new Schema(
  {
    ticker: {
      type: String,
      required: true,
    }, // Mã cổ phiếu
    vol: {
      type: Number,
      required: true,
    }, // Khối lượng giao dịch
    price: {
      type: String,
      required: true,
    }, // Giá giao dịch
    ave: {
      type: String,
      required: true,
    }, // Giá trung bình
    profit: {
      type: String,
      required: true,
    }, // Lợi nhuận
    change: {
      type: String,
      required: true,
    }, // Thay đổi
    percent: {
      type: String,
      required: true,
    }, // Phần trăm thay đổi
  },
  {
    timestamp: true,
    collection: COLLECTION_NAME,
  },
)

//Export the model
module.exports = model(DOCUMENT_NAME, dataSellSchema)
