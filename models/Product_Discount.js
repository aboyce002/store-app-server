const { Model } = require('objection');

class Product_Discount extends Model {
  static get tableName() {
    return 'product_discount';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['percent_discount', 'active'],

      // Add discount model?
      properties: {
        id: { type: 'integer' },
        title: { type: 'string' },
        description: { type: 'string' },
        percent_discount: { type: 'number' },
        active: { type: 'boolean' }
      }
    }
  }
}

module.exports = Product_Discount;
