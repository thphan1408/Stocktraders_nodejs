const express = require('express')
const morgan = require('morgan')
const { default: helmet } = require('helmet')
const compression = require('compression')
const dotenv = require('dotenv')
const { notFound, errorHandler } = require('./core/error')
const app = express()
const http = require('http')
const { Server } = require('socket.io')
// dotenv
dotenv.config()

/**
 * init middlewares
 */
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())

/**
 * init db
 */
require('./db/init.mongo')
// const { checkOverload } = require('./helpers/check.connect')
// checkOverload()

/**
 * websocket connection
 */
// const server = http.createServer(app)
// const io = new Server(server)

// io.on('connection', (socket) => {
//   console.log('Websocket connected')

//   socket.on('message', (message) => {
//     console.log(`Received message => ${message}`)

//     socket.emit('server received message', message)
//   })

//   socket.on('disconnected', () => {
//     console.log('Websocket disconnected')
//   })
// })

/**
 * fetch data from api realtime after 5s
 */

/**
 * init routes
 */

app.use('/api/v1', require('./routes/root.routes'))

/**
 * handle errors
 */
app.use(notFound)
app.use(errorHandler)

module.exports = app
