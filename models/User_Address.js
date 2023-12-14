const { Model } = require('objection');

class User_Address extends Model {
  static get tableName() {
    return 'user_address';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['user_id', 'street', 'zip', 'country'],
      properties: {
        id: { type: 'integer' },
        user_id: { type: 'integer' },
        street: { type: 'string' },
        street2: { type: 'string' },
        street3: { type: 'string' },
        city: { type: 'string' },
        state: { type: 'string' },
        zip: { type: 'string' },
        country: { type: 'string' }
      }
    }
  }
}

module.exports = User_Address;
