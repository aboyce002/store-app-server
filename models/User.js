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
      required: [ 'email' ],
      anyOf: [
        { required: [ 'google_id' ] },
        { required: [ 'password' ] }
      ],
      properties: {
          id: {type: 'integer'},
          google_id: {type: 'string'},
          email: {type: 'string'},
          // Stores bcrypt encrypted password
          password: {type: 'string'},
          // Store as pure numbers i.e 3024340607
          phone: {type: 'string'},
          /*addresses: {
            type: 'object[]',
            properties: {
              street: { type: 'string' },
              street2: { type: 'string' },
              street3: { type: 'string' },
              city: { type: 'string' },
              state: { type: 'string' },
              zip: { type: 'string' },
              country: { type: 'string' }
            }
          }*/
      }
    }
  }
}

module.exports = User;
