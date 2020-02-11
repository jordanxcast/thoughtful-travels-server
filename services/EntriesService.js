/* eslint-disable semi */
const entriesService = {
  getAllEntries(knex) {
    return knex.select('*').from('journal_entries')
  },
  
  insertEntry(knex, newEntry) {
    return knex 
      .insert(newEntry)
      .into('journal_entries')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },

  getById(knex, id) {
    return knex 
      .from('journal_entries')
      .select('*')
      .where('id', id)
      .first()
  },

  deleteEntry(knex, id) {
    return knex('journal_entries')
      .where({ id })
      .delete()
  },

  updateEntry(knex, id, entryUpdates) {
    return knex('journal_entries')
      .where({ id })
      .update(entryUpdates)
  },
};

module.exports = entriesService;