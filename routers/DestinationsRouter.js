/* eslint-disable semi */
const path = require('path')
const express = require('express')
const xss = require('xss')
const destinationsService = require('../services/DestinationsService')
const destinationsRouter = express.Router()
const bodyParser = express.json()

// const serializeDestination = d => ({
//   id: d.dest_id,
//   dest_title: xss(d.dest_title),
// })

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
    const {dest_title, goal_date, budget} = req.body
    const newDest = {
      goal_date: goal_date,
      budget: budget
    }

    //validation that required fields are in post request
    if(!dest_title) {
      return res.status(400).json({ 
        error: {
          message: 'Missing dest_title in request body'
        }
      })
    }

    destinationsService.insertDestination(
      req.app.get('db'),
      dest_title
    )
      .then(destCreated => {
        destinationsService.insertDestDetails(
          req.app.get('db'),
          destCreated.dest_id,
          newDest
        )
      })
      
      .then(dest => {
        res
          .status(201)
          .json(dest)
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
    const knexInstance = req.app.get('db')

    destinationsService.getDestination(
      knexInstance,
      req.params.dest_id
    )
      .then(d => {
        res.json(d)
      })
      // .then(d => {
      //   res.json(d.map(serializeDestination))
      // })
      .catch(next)
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
    const { dest_id, dest_title, goal_date, budget } = req.body
    const destDataUpdate = {
      goal_date: goal_date,
      budget: budget,
    }

    if( req.params.dest_id == null ) {
      return res.status(400).json({
        error: {
          message: 'Request body must contain the destination\'s id'
        }
      })
    }

    destinationsService.updateDestination(
      req.app.get('db'),
      dest_id,
      dest_title
    )
      .then(destUpdate => {
        destinationsService.updateDestDetails(
          req.app.get('db'),
          dest_id,
          destDataUpdate
        )
      })
      .then(numRowsAffected => {
        res
          .status(204)
          .end()
      })
      .catch(next)
  })


module.exports = destinationsRouter