/* eslint-disable semi */
const path = require('path')
const express = require('express')
const xss = require('xss')
const entriesService = require('../services/EntriesService')
const entriesRouter = express.Router()
const bodyParser = express.json()

entriesRouter 
  .route('/api/entries/:dest_id')
  .get((req, res, next) => {
    entriesService.getDestEntries(
      req.app.get('db'),
      req.params.dest_id
    )
      .then(entries => {
        res.json(entries)
      })
      .catch(next)
  })
  .post(bodyParser, (req, res, next) => {
    //validation that required fields are in the post request 
    const { subject, body } = req.body
    const newEntry = {
      subject: subject,
      body: body,
      dest_id: req.params.dest_id
    }

    if(subject == null || body == null) {
      return res.status(400).json({ error: {message: 'Missing field in request body'} })
    }

    entriesService.insertEntry(
      req.app.get('db'),
      newEntry
    )
      .then(entry => {
        res.status(201).json(entry)
      })
      .catch(next)
  })

entriesRouter
  .route('/api/entries/:entry_id')
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

module.exports = entriesRouter