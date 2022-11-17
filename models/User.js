const { Model } = require('objection');

class User extends Model {
  static get tableName(){
    return 'user';
  }

  static get idColumn() {
    return 'id';
  }
  
  static get jsonSchema () {
    return {
        type: 'object',
        required: [ 'google_id' ],

        properties: {
            id: {type: 'integer'},
            google_id: {type: 'string'}
        }
    };
  }
}

module.exports = User;
