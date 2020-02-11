/* eslint-disable semi */
const DestinationsService = {
  getAllDestinations(knex) {
    return knex.select('*').from('destinations')
  },

  insertDestination(knex, newDesttination) {
    return knex
      .insert(newDesttination)
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
      .where({ id })
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