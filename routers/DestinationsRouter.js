/* eslint-disable semi */
const path = require('path')
const express = require('express')
const xss = require('xss')
const destinationsService = require('../services/DestinationsService')
const { requireAuth } = require('../src/middleware/jwt-auth')
const destinationsRouter = express.Router()
const bodyParser = express.json()

// const serializeDestination = d => ({
//   id: d.dest_id,
//   dest_title: xss(d.dest_title),
// })

//map through responded array of data to serialize

destinationsRouter
  .route('/api/destinations')
  .all(requireAuth)
  .get((req, res, next) => {
    const { id } = req.user
    const knexInstance = req.app.get('db')

    destinationsService.getAllDestinations(knexInstance, id)
      .then(dest => {
        res.json(dest)
      })
      // .then(d => {
      //   res.json(d.map(serializeDestination))
      // })
      .catch(next)
  })
  .post(bodyParser, (req, res, next) => {
    const { id } = req.user
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

    // newDest.user_id = req.user.id

    destinationsService.insertDestination(
      req.app.get('db'),
      dest_title
    )
      .then(destCreated => {
        return destinationsService.insertDestDetails(
          req.app.get('db'),
          destCreated.dest_id,
          newDest,
          id
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
  .all(requireAuth)
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
      .then(dest => {
        res.json(dest)
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
    console.log(destDataUpdate, typeof(dest_id), typeof(dest_title))

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
        console.log(destUpdate, 'dest updated', destDataUpdate)

        destinationsService.updateDestDetails(
          req.app.get('db'),
          dest_id,
          null, 
          budget
        )
          .then((numRowsAffected) => {
            console.log(numRowsAffected, '!!!!')
            res
              .json(numRowsAffected)
              .status(204)
              .end()
          })
      })
      
      .catch(next)
  })


module.exports = destinationsRouter