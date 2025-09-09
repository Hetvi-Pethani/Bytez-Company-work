const mongoose = require('mongoose');

const customerBillItemSchema = new mongoose.Schema({
    registerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'registers',
        required: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customers',
        required: true
    },
    customerBillId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customerbills',
        required: true
    },
    stockId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stocks',
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true
    },
    qty: {
        type: Number,
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
    },

    stockId: { type: mongoose.Schema.Types.ObjectId, ref: 'stocks', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
    qty: { type: Number, required: true },
    rate: { type: Number, required: true },
    amount: { type: Number, required: true },


}, { timestamps: true });

const CustomerBillItem = mongoose.model('customerbillitems', customerBillItemSchema);
module.exports = CustomerBillItem;