const mongoose = require('mongoose');

const subcategorySchma = mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    },

    registerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'registers'
    },

    subcategory: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'active'
    },
    image: {
        type: String,
        required: true
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

const Subcategory = mongoose.model('subcategory', subcategorySchma)
module.exports = Subcategory;