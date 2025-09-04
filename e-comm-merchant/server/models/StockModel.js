
const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
    registerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'register',
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    subcategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subcategory',
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },
    sizeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'size',
        required: true
    },
    colorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'color',
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'active',
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
}, { timestamps: true });


const Stock = mongoose.model("stocks", stockSchema);
module.exports = Stock;