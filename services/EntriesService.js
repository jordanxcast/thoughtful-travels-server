/* eslint-disable semi */
const entriesService = {
  getAllEntries(knex) {
    return knex.select('*').from('journal_entries')
  },

  getDestEntries(knex, destId){
    return knex.select('*').from('journal_entries').join('user_dest', {'journal_entries.dest_id': 'user_dest.dest_id'}).where({'user_dest.dest_id': destId})
  },
  
  insertEntry(knex, newEntry) {
    return knex 
      .insert({dest_id: newEntry.dest_id, subject: newEntry.subject, body: newEntry.body})
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