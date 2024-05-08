const { Model } = require('objection');

class Order extends Model {
  static get tableName() {
    return 'order';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['address_id', 'provider', 'status', 'preorder', 'paid', 'date_created', 'total'],
      anyOf: [
        { required: ['user_id'] },
        { required: ['email'] }
      ],

      // Add discount model?
      properties: {
        // Used on order page #1
        id: { type: 'integer' },
        user_id: { type: 'integer' },
        // Edit this later with the actual address info at the time of order placement because it's gg if the user deletes the address
        // Used on order page #4
        address_id: { type: 'integer' },
        email: { type: 'string' },
        provider: {
          type: 'string',
          enum: ['stripe', 'paypal', 'other'],
          default: 'other'
        },
        status: {
          type: 'string',
          enum: ['processing', 'delivering', 'fulfilled'],
          default: 'processing'
        },
        shipped_by: { type: 'string' },
        tracking_number: { type: 'integer' },
        preorder: { type: 'boolean', },
        paid: { type: 'boolean', },
        // Probably make discount a separate model
        discount: { type: 'number' },
        // Used on order page #3
        total: { type: 'number' },
        // Used on order page #2
        date_created: { type: 'date' },
        ship_date: { type: 'date' },
        order_fufilled_date: { type: 'date' }
      }
    };
  }

  static get relationMappings() {
    const Order_Details = require('./Order_Details');

    return {
      order_details: {
        relation: Model.HasManyRelation,
        modelClass: Order_Details,
        join: {
          from: 'order.id',
          to: 'order_details.order_id'
        }
      }
    };
  }
}

module.exports = Order;
