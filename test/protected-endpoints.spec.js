/* eslint-disable semi */
const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')


describe.only('Protected endpoints', () => {

  let db

  const { 
    testUsers, 
    testDests, 
    testItems, 
    testEntries 
  } = helpers.makeDestinationsFixture()


  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup before', () => helpers.cleanTables(db))

  afterEach('cleanup after', () => helpers.cleanTables(db))

  beforeEach('insert content for tables', () =>
    helpers.seedDestTables(
      db,
      testUsers, 
      testDests, 
      testItems, 
      testEntries 
    )
  )

  const protectedEndpoints = [
    {
      name: 'GET /api/destinations',
      path: '/api/destinations',
      method: supertest(app).get,
    },
    {
      name: 'POST /api/destinations',
      path: '/api/destinations',
      method: supertest(app).post,
    },
    {
      name: 'GET /api/destinations/:dest_id',
      path: '/api/destinations/1',
      method: supertest(app).get,
    }
  ]

  protectedEndpoints.forEach(endpoint => {
    describe(endpoint.name, () => {
      it('responds 401 \'Missing bearer token\' when no token', () => {
        return endpoint.method(endpoint.path)
          .expect(401, {error: 'Missing bearer token'})
      })

      it('responds 401 \'Unauthorized request\' when invalid JWT secret', () => {
        // const userNoCreds = { user_name: '', password: '' }
        const validUser = testUsers[0]
        const invalidJWTSecret = 'bad-secret'
        return endpoint.method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(validUser, invalidJWTSecret))
          .expect(401, { error: 'Unauthorized request' })
      })

      it('responds 401 \'Unauthorized request\' when invalid sub in the payload', () => {
        const invalidUser = { username: 'user-not', id: 1 }
        return endpoint.method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(invalidUser))
          .expect(401, { error: 'Unauthorized request' })
      })
    })
  })

})