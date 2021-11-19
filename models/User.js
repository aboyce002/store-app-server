const {Model} = require('objection');

class User extends Model {
  static get tableName(){
    return 'user';
  }

  static get idColumn() {
    return '_id';
  }
  
  static get jsonSchema () {
    return {
        type: 'object',
        required: [ 'google_id' ],

        properties: {
            _id: {type: 'integer'},
            google_id: {type: 'string'}
        }
    };
  }
}

module.exports = User;
