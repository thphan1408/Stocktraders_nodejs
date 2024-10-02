const app = require('./src/app')

const port = process.env.PORT || 8080

const server = app.listen(port, () => {
  console.log(`Server running on port ${server.address().port}`)
})

process.on('SIGINT', () => {
  server.close(() => console.log('Server has been disconnected'))
})
