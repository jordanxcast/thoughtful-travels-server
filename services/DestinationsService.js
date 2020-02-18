/* eslint-disable semi */
const DestinationsService = {
  getAllDestinations(knex) {
    return knex.select('*').from('destinations').innerJoin('user_dest', 'destinations.dest_id', 'user_dest.dest_id')
  },

  getDestination(knex, destId) {
    return knex.select('*').from('destinations').innerJoin('user_dest', 'destinations.dest_id', 'user_dest.dest_id').where({dest_id: destId})
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

  insertDestDetails(knex, destId, newDest) {
    return knex
      .into('user_dest')
      .insert({dest_id: destId, goal_date: newDest.goal_date, budget: newDest.budget})
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
      .update({dest_title: destTitle});
  },

  updateDestDetails(knex, destId, newData){
    return knex('user_dest')
      .where({dest_id: destId})
      .update({dest_id: destId, goal_date: newData.goal_date, budget: newData.budget})
  },

  deleteDestination(knex, id) {
    return knex('destinations')
      .where({ dest_id: id })
      .delete();
  }
};

module.exports = DestinationsService