const { Model } = require('objection');

class User extends Model {
  static get tableName() {
    return 'user';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['email'],
      anyOf: [
        { required: ['google_id'] },
        { required: ['password'] }
      ],
      properties: {
        id: { type: 'integer' },
        google_id: { type: 'string' },
        email: { type: 'string' },
        // Stores bcrypt encrypted password
        password: { type: 'string' },
        // Store as pure numbers i.e 3024340607
        phone: { type: 'string' },
        // The address id of the user's current primary address
        main_address: { type: 'integer' }
      }
    }
  }

  static get relationMappings() {
    const Order = require('./Order');
    const User_Address = require('./User_Address');

    return {
      orders: {
        relation: Model.HasManyRelation,
        modelClass: Order,
        join: {
          from: 'user.id',
          to: 'order.user_id'
        }
      },
      addresses: {
        relation: Model.HasManyRelation,
        modelClass: User_Address,
        join: {
          from: 'user.id',
          to: 'user_address.user_id'
        }
      }
    };
  }
}

module.exports = User;
