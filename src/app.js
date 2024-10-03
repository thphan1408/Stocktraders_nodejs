const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')
const dotenv = require('dotenv')
const { notFound, errorHandler } = require('./core/error')
const app = express()

// dotenv
dotenv.config()

/**
 * init middlewares
 */
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())

/**
 * init db
 */
require('./db/init.mongo')
// const { checkOverload } = require('./helpers/check.connect')
// checkOverload()

/**
 * init routes
 */
app.use('/', require('./routes/root.routes'))

/**
 * handle errors
 */
app.use(notFound)
app.use(errorHandler)

module.exports = app
