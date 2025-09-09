const mongoose = require('mongoose');

const customerBillSchema = new mongoose.Schema({
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
    billNo: {
        type: String,
        required: true
    },
    billDate: {
        type: Date,
        default: Date.now
    },
    billTotal: {
        type: Number,
        required: true
    },
    cgst: {
        type: Number,
        required: true
    },
    sgst: {
        type: Number,
        required: true
    },
    grandTotal: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        enum: [1, 2]
    },
    discountAmount: {
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
    customerBillItemsId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customerbillitems'
    }]

}, {
    timestamps: true
});


const CustomerBill = mongoose.model('customerbills', customerBillSchema);
module.exports = CustomerBill;