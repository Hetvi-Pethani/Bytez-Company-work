const mongoose = require('mongoose');

const exsubcategorySchma = mongoose.Schema({
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
        ref: 'registers'
    },

    exsubcategory: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'active'
    }
});

const exsubcategory = mongoose.model('exsubcategory', exsubcategorySchma)
module.exports = exsubcategory;