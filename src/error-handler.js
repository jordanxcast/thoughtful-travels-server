/* eslint-disable semi */
const { NODE_ENV } = require('./config')
const logger = require('./logger')

function errorHandler( req, res, error) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } }
  } else {
    logger.error(error.message)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
}

module.exports = errorHandler