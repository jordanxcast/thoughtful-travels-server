/* eslint-disable semi */
const DestinationsService = {
  getAllDestinations(knex, userId) {
    return knex.select('*').from('destinations').join('user_dest', {'destinations.dest_id': 'user_dest.dest_id'}).where({'user_dest.user_id': userId})
  },

  getDestination(knex, destId) {
    return knex.select('*').from('destinations').join('user_dest', {'destinations.dest_id': 'user_dest.dest_id'}).where({'destinations.dest_id': destId}).first()
  },

  insertDestination(knex, destTitle) {
    return knex
      .into('destinations')
      .insert({dest_title: destTitle})
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },

  insertDestDetails(knex, destId, newDest, id) {
    return knex
      .into('user_dest')
      .insert({dest_id: destId, goal_date: newDest.goal_date, budget: newDest.budget, user_id: id})
      .returning('*')
      .then(rows => {
        return rows[0];
      })
  },

  getById(knex, id) {
    return knex 
      .from('destinations')
      .select('*')
      .where({ dest_id: id })
      .first();
  },

  updateDestination(knex, destId, destTitle) {
    return knex('destinations')
      .where({ dest_id: destId })
      .first()
      .update({dest_title: destTitle})
      .returning('*')
      .then(rows => {
        return rows[0];
      })
  },

  updateDestDetails(knex, destId, date, budget){
    return knex('user_dest')
      .where({dest_id: destId})
      .first()
      .update({goal_date: date, budget: budget})
      .returning('*')
      .then(rows => {
        return rows[0];
      })
      
  },

  deleteDestination(knex, id) {
    return knex('destinations')
      .where({ dest_id: id })
      .delete();
  }
};

module.exports = DestinationsService