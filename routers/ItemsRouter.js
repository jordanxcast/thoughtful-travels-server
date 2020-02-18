/* eslint-disable semi */
const express = require('express')
const itemsService = require('../services/ItemsService')
const destinationsService = require('../services/DestinationsService')
const itemsRouter = express.Router()
const bodyParser = express.json()


itemsRouter 
  .route('/api/items/:dest_id')
  .get((req, res, next) => {
    itemsService.getDestItems(
      req.app.get('db'),
      req.params.dest_id
    )
      .then(items => {
        res.json(items)
      })
      .catch(next)
  })
  .post(bodyParser, (req, res, next) => {
    const { item_content } = req.body

    if(item_content == null) {
      return res.status(400).json({ error: {message: 'Content missing in request body'}})
    }

    itemsService.insertItem(
      req.app.get('db'),
      req.params.dest_id,
      item_content
    )
      .then(item => {
        res.status(201).json(item)
      })
      .catch(next)
  })

itemsRouter
  .route('/api/items/:item_id')
  .delete((req, res, next) => {
    itemsService.deleteItem(
      req.app.get('db'),
      req.params.item_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = itemsRouter