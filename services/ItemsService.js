const itemsService = {
  getDestItems(knex, destId){
    return knex.select('*').from('items').join('user_dest', {'items.dest_id': 'user_dest.dest_id'}).where({'user_dest.dest_id': destId});
  },

  insertItem(knex, destId, newItem) {
    return knex 
      .insert({item_content: newItem, dest_id: destId})
      .into('items')
      .where({dest_id: destId})
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

  deleteItem(knex, item_id){
    return knex('items')
      .where({item_id})
      .delete();
  }

};

module.exports = itemsService;