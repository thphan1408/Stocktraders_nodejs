'use strict'

const { model, Schema } = require('mongoose')

const DOCUMENT_NAME = 'DataSell'
const COLLECTION_NAME = 'dataSells'

// ticker, vol, price, ave, profit, change, percent

// Declare the Schema of the Mongo model
const dataSellSchema = new Schema(
  {
    data: {
      type: [
        {
          ticker: { type: String },
          vol: { type: Number },
          price: { type: String },
          ave: { type: String },
          profit: { type: String },
          change: { type: String },
          percent: { type: String },
        },
      ],
      required: true,
      _id: false,
    },
    date: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
)

//Export the model
module.exports = model(DOCUMENT_NAME, dataSellSchema)
