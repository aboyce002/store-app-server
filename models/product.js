const {Model} = require('objection');

class Product extends Model {
  static get tableName(){
    return 'product';
  }

  static get idColumn() {
    return '_id';
  }

  static get jsonSchema () {
    return {
        type: 'object',
        required: [ 'title, description, category, image, price' ],

        properties: {
            _id: {type: 'integer'},
            title: {type: 'string'},
            description: {type: 'string'},
            category: {type: 'string'},
            image: {type: 'string'},
            price: {type: 'number'},
            quantity: {type: 'integer'},
            condition: {type: 'string'},
            availability: {type: 'string'}
        }
    };
  }
}

module.exports = Product;
