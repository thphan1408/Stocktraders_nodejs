'use strict'

const { model, Schema } = require('mongoose')

const DOCUMENT_NAME = 'DataSignal'
const COLLECTION_NAME = 'dataSignals'

// ticker, vol, price, ave, profit, change, percent

// Declare the Schema of the Mongo model
var dataSignalSchema = new Schema(
    {
        signal: {
            type: String,
            required: true, // 'buy', 'sell', 'hold'
            enum: ['databuy', 'datasell', 'datahold']
        },
        data: {
            type: [
                {
                    ticker: { type: String },
                    vol: { type: Number },
                    price: { type: String },
                    ave: { type: String },
                    profit: { type: String },
                    change: { type: String },
                    percent: { type: String }
                }
            ],
            required: true
        },
        date: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
)

//Export the model
module.exports = model(DOCUMENT_NAME, dataSignalSchema)
