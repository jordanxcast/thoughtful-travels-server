/* eslint-disable semi */
const path = require('path')
const express = require('express')
const xss = require('xss')
const destinationsService = require('../services/DestinationsService')
const itemsService = require('../services/ItemsService')
const entriesService = require('../services/EntriesService')

const destinationsRouter = express.Router()
const bodyParser = express.json()

const serializeDestination = d => ({
  id: d.dest_id,
  dest_title: xss(d.dest_title),

})

//map through responded array of data to serialize

destinationsRouter
  .route('/api/destinations')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')

    destinationsService.getAllDestinations(knexInstance)
      .then(d => {
        res.json(d)
      })
      // .then(d => {
      //   res.json(d.map(serializeDestination))
      // })
      .catch(next)
  })
  .post(bodyParser, (req, res, next) => {
    //validation that required fields are in post request
    const {dest_title, goal_date, budget} = req.body
    const newDest = {
      title: dest_title,
      date: goal_date,
      budget: budget
    }

    if(dest_title == null) {
      return res.status(400).json({ error: { message: 'Missing dest_title in request body'}})
    }

    destinationsService.insertDestination(
      req.app.get('db'),
      newDest
    )
      .then(dest => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${dest.id}`))
          .json(serializeDestination(dest))
      })
      .catch(next)
  })

destinationsRouter
  .route('/api/destinations/:dest_id')
  .all((req, res, next) => {
    destinationsService.getById(
      req.app.get('db'),
      req.params.dest_id
    )
      .then(dest => {
        if(!dest) {
          return res.status(404).json({
            error: { message: 'This destination does not exist' }
          })
        }
        res.dest = dest
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    itemsService.getDestItems(
      req.app.get('db'),
      req.params.dest_id
    )
      .then(items => {

        res.json(items)
      })
      .catch(next)
    // res.json(serializeDestination(res.dest))
  })
  .delete((req, res, next) => {
    destinationsService.deleteDestination(
      req.app.get('db'),
      req.params.dest_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(bodyParser, (req, res, next) => {
    const { id, dest_title, goal_date, budget } = req.body
    const destDataUpdate = {
      dest_title: dest_title,
      goal_date: goal_date,
      budget: budget,
    }
    if( id == null ) {
      return res.status(400).json({
        error: {
          message: 'Request body must contain the destination\'s id'
        }
      })
    }
    destinationsService.updateDestination(
      req.app.get('db'),
      req.params.dest_id,
      destDataUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

destinationsRouter 
  .route('/api/entries/:entry_id')
  .get((req, res, next) => {
    entriesService.getDestEntries(
      req.app.get('db'),
      req.params.entry_id
    )
      .then(items => {

        res.json(items)
      })
      .catch(next)
    // res.json(serializeDestination(res.dest))
  })
  .delete((req, res, next) => {
    entriesService.deleteEntry(
      req.app.get('db'),
      req.params.entry_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

destinationsRouter 
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


module.exports = destinationsRouter