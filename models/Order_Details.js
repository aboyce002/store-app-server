const { Model } = require('objection');

class Order_Details extends Model {
  static get tableName() {
    return 'order_details';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['order_id', 'product_id', 'product_title', 'price', 'quantity', 'total'],

      // Add discount model?
      properties: {
        id: { type: 'integer' },
        order_id: { type: 'integer' },
        product_id: { type: 'integer' },
        product_title: { type: 'string' },
        price: { type: 'number' },
        quantity: { type: 'integer' },
        discount: { type: 'number' },
        total: { type: 'integer' }
      }
    };
  }
}

module.exports = Order_Details;
