/* eslint-disable semi */
const knex = require('knex')
const jwt = require('jsonwebtoken')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Auth User Endpoints', function() {
  let db

  const testUsers = helpers.makeUsersArray()
  const testUser = testUsers[0]

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  this.afterEach('cleanup', () => helpers.cleanTables(db))

  describe('POST /api/users', () => {
    this.beforeEach('insert users', () => {
      helpers.seedUsers(
        db, 
        testUsers
      )
    })

    const requireFields = ['user_name', 'password']

    requireFields.forEach(field => {
      const loginAttemptBody = {
        user_name: testUser.user_name,
        password: testUser.password,
      }

      it(`responds with 400 required error when '${field}' is missing`, () => {
        delete loginAttemptBody[field]

        return supertest(app)
          .post('/api/users')
          .send(loginAttemptBody)
          .expect(400)
      })

      it('responds with 200 and JWT auth token using secret when valid credentials', () => {
        const userValidCreds= {
          fullname: testUser.fullname,
          username: testUser.username,
          password: testUser.password,
          date_created: '2020-01-20 00:00:00'
        }

        const expectedToken = jwt.sign(
          { id: testUser.id },
          process.env.JWT_SECRET,
          {
            subject: testUser.username,
            algorithm: 'HS256',
          }
        )
        return supertest(app)
          .post('/api/users')
          .send(userValidCreds)
          .expect(200, {
            authToken: expectedToken
          })
      })
    })
  })

})