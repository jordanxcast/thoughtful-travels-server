/* eslint-disable semi */
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const errorHandler = require('./error-handler')
const destinationsRouter = require('../routers/DestinationsRouter')
const entriesRouter = require('../routers/EntriesRouter')
const itemsRouter = require('../routers/ItemsRouter')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(cors())
app.use(helmet())

app.use(destinationsRouter)
app.use(entriesRouter)
app.use(itemsRouter)

app.get('/', (req, res) => {
  res.send('Hello, boilerplate!')
})

app.use(errorHandler)

module.exports = app