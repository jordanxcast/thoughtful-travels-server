const itemsService = {
  getDestItems(knex, destId){
    return knex.select('*').from('items').where({dest_id: destId});
  },

  insertItem(knex, newItem) {
    return knex 
      .insert(newItem)
      .into('items')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },

  getItemById(knex, id) {
    return knex
      .from('items')
      .select('*')
      .where('id', id)
      .first();
  },

  deleteItem(knex, id){
    return knex('items')
      .where({ id })
      .delete();
  }

};

module.exports = itemsService;