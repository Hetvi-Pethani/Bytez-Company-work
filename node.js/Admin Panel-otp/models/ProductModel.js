const mongoose = require('mongoose');

const productSchma = mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    },
    subcategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subcategory'
    },
    exsubcategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'exsubcategory'
    },
    product: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'active'
    }
});

const product = mongoose.model('product', productSchma)
module.exports = product;