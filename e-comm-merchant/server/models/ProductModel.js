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
    registerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'register'
    },
    product: {
        type: String,
        require: true
    },
    image: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'active'
    },
    searchKeywords: {
        type: String
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deleted_at: {
        type: Date,
        default: null
    }
}, {
    timestamps: true


});

const Product = mongoose.model('product', productSchma)
module.exports = Product;