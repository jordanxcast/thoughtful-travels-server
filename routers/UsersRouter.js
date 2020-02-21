/* eslint-disable semi */
const express = require('express')
// const path = require('path')
const UsersService = require('../services/UsersService')

const usersRouter = express.Router()
const bodyParser = express.json()

usersRouter 
  .post ('/api/users', bodyParser, (req, res, next) => {
    const { password, username, fullname } = req.body

    for(const field of ['fullname', 'username', 'password'])
      if(!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        })

    const passwordError = UsersService.validatePassword(password)
    // if(passwordError)
    //   return res.status(400).json({ error: passwordError})

    UsersService.hasUserWithUserName(
      req.app.get('db'),
      username
    )
      .then(hasUserWithUserName => {
        if (hasUserWithUserName) {
          return res.status(400).json({ error: 'Username already taken'})
        }
        
        return UsersService.hashPassword(password)
          .then(hashedPassword => {
            const newUser = {
              username, 
              password: hashedPassword,
              fullname,
              // date_created: 'now()',
            }
            
            return UsersService.insertUser(
              req.app.get('db'),
              newUser
            )
              .then(user => {
                res
                  .status(201)
                  .json(UsersService.serializeUser(user))
              })
          })
      })
      .catch(next)
  })

module.exports = usersRouter