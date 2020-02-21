/* eslint-disable semi */
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE 
        items,
        journal_entries,
        user_dest, 
        t_travels_users,
        destinations
      `
    )
      .then(() => 
        Promise.all([
          trx.raw('ALTER SEQUENCE destinations_dest_id_seq minvalue 0 START WITH 1'),
          trx.raw('ALTER SEQUENCE user_dest_userdest_id_seq minvalue 0 START WITH 1'),
          trx.raw('SELECT setval(\'destinations_dest_id_seq\', 0)'),
          trx.raw('SELECT setval(\'user_dest_userdest_id_seq\', 0)'),
        ])
      )
  )
}

function makeUsersArray() {
  return [
    {
      id: 1,
      fullname: 'Jordan Castillo',
      username: 'jordan02',
      password: 'Jc#1234',
      date_created: '2020-01-20 00:00:00',
    },
    {
      id: 2,
      fullname: 'Matthew Mullen',
      username: 'matt03',
      password: 'Mm#1234',
      date_created: '2020-01-20 00:00:00',
    },
    {
      id: 3,
      fullname: 'Kaiya Quin',
      username: 'kaiya04',
      password: 'Kq#1234',
      date_created: '2020-01-20 00:00:00',
    },
  ]
}

function makeDestinationsArray(users) {
  return [
    {
      dest_id: 4,
      dest_title: 'Reno',
      completed: false,
    },
    {
      dest_id: 5,
      dest_title: 'Barcelona',
      completed: false,
    },
    {
      dest_id: 6,
      dest_title: 'New Zealand',
      completed: false,
    },
  ]
}

function makeItemsArray(users) {
  return [
    {
      item_id: 7,
      user_dest_id: null,
      item_content: 'item content test 1',
      dest_id: 4,
    },
    {
      item_id: 8,
      user_dest_id: null,
      item_content: 'item content test 1',
      dest_id: 5,
    },
    {
      item_id: 9,
      user_dest_id: null, 
      item_content: 'item content test 1',
      dest_id: 6,
    },
  ]
}

function makeEntriesArray(users) {
  return [
    {
      id: 7,
      subject: null,
      body: 'item content test 1',
      user_dest_id: 4,
      dest_id: 4,
      dest_created: '2020-02-20 20:43:10.310604',
    },
    {
      id: 8,
      subject: null,
      body: 'item content test 2',
      user_dest_id: 5,
      dest_id: 5,
      dest_created: '2020-02-20 20:43:10.310604',
    },
    {
      id: 9,
      subject: null, 
      body: 'item content test 3',
      user_dest_id: 6,
      dest_id: 6,
      dest_created: '2020-02-20 20:43:10.310604',
    },
  ]
}

function makeDestinationsFixture() {
  const testUsers = makeUsersArray()
  const testDests = makeDestinationsArray(testUsers)
  const testItems = makeItemsArray(testUsers)
  const testEntries = makeEntriesArray(testUsers)
  
  return { testUsers, testDests, testItems, testEntries }
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('t_travels_users').insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(
        `SELECT setval('t_travels_users_id_seq', ?)`,
        [users[users.length - 1].id],
      )
    )
}



module.exports = {
  cleanTables,
  makeUsersArray,
  makeDestinationsArray,
  makeItemsArray, 
  makeEntriesArray,
  makeDestinationsFixture,
  seedUsers
}