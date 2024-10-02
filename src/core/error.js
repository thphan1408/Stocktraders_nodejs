const notFound = (req, res, next) => {
  res.status(404).json({ status: 'error', message: 'Resource not found' })
}

const errorHandler = (err, req, res, next) => {
  console.error(err.stack)
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    // stack: err.stack,
    message: err.message || 'Internal Server Error',
  })
}

module.exports = { notFound, errorHandler }
