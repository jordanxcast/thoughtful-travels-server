/* eslint-disable semi */
const DestinationsService = {
  getAllDestinations(knex) {
    return knex.select('*').from('destinations').innerJoin('user_dest', 'destinations.dest_id', 'user_dest.dest_id')
  },

  insertDestination(knex, newDestination) {
    return knex
      .insert(newDestination)
      .into('destinations')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },

  getById(knex, id) {
    return knex 
      .from('destinations')
      .select('*')
      .where({ dest_id: id })
      .first();
  },

  updateDestination(knex, id, newData) {
    return knex('destinations')
      .where({ id })
      .update(newData);
  },

  deleteDestination(knex, id) {
    return knex('destinations')
      .where({ id })
      .delete();
  }
};

module.exports = DestinationsService