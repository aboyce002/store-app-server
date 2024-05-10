const { Model } = require('objection');

class Product extends Model {
  static get tableName() {
    return 'product';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['title', 'description', 'category', 'image', 'price'],

      properties: {
        id: { type: 'integer' },
        title: { type: 'string' },
        description: { type: 'string' },
        image: { type: 'string' },
        price: { type: 'number' },
        quantity: { type: 'integer' },
        condition: {
          type: 'string',
          enum: ['for sale', 'new', 'preorder'],
          default: 'for sale'
        },
        availability: {
          type: 'string',
          enum: ['available', 'unavailable', 'sold out'],
          default: 'available'
        },
        category: {
          type: 'string',
          enum: ['charms', 'prints', 'plushies', 'stickers'],
          default: 'prints'
        },
        additional_images: { type: 'string[]' },
      }
    }
  }
}

module.exports = Product;
