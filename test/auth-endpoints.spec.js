/* eslint-disable semi */
const knex = require('knex')
const jwt = require('jsonwebtoken')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Auth User Endpoints', function() {
  let db

  const {testUsers} = helpers.makeDestinationsFixture()
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

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe('POST /api/auth/login', () => {
    beforeEach('insert users', () => {
      helpers.seedUsers(
        db, 
        testUsers
      )
    })

    const requireFields = ['username', 'password']

    requireFields.forEach(field => {
      const loginAttemptBody = {
        username: testUser.username,
        password: testUser.password,
      }

      it(`responds with 400 required error when '${field}' is missing`, () => {
        delete loginAttemptBody[field]

        return supertest(app)
          .post('/api/auth/login')
          .send(loginAttemptBody)
          .expect(400)
      })

      it('responds 400 \'invalid username or password\' when bad username', () => {
        const userInvalid = {username: 'user-not-exist', password: 'existy' }
        return supertest(app)
          .post('/api/auth/login')
          .send(userInvalid)
          .expect(400)
      })

      it('responds 400 \'invalid username or password\' when bad password', () => {
        const userInvalidPW = { username: testUser.username, password: 'incorrectPW' }
        return supertest(app)
          .post('/api/auth/login')
          .send(userInvalidPW)
          .expect(400)
      })

      it('responds with 200 and JWT auth token using secret when valid credentials', () => {
        const userValidCreds= {
          username: testUser.username,
          password: testUser.password,
        }

        const expectedToken = jwt.sign(
          { id: testUser.id }, //payload
          process.env.JWT_SECRET,
          {
            subject: testUser.username,
            algorithm: 'HS256',
          }
        )
        return supertest(app)
          .post('/api/auth/login')
          .send(userValidCreds)
          .expect(200, {
            authToken: expectedToken
          })
      })
    })
  })

})