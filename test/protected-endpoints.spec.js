/* eslint-disable semi */
const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

// // describe.skip('Destinations Endpoints', function() {
//   let db

//   // const{

//   // } = helpers.makeDestinationsFixtures()

//   before('make knex instance', () => {
//     db = knex({
//       client: 'pg',
//       connection: process.env.TEST_DATABASE_URL,
//     })
//     app.set('db', db)
//   })

//   after('disconnect from db', () => db.destroy())

//   before('cleanup', () => helpers.cleanTables(db))

//   this.afterEach('cleanup', () => helpers.cleanTables(db))

//   describe('GET /api/destinations', () => {
//     context('Given no destinations', () => {
//       it('responds with 200 and an empty list', () => {
//         return supertest(app)
//           .get('/api/destinations')
//           .expect(200, [])
//       })
//     })
//   })

// })