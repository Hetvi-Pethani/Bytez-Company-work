const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    registerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'registers',
        required: true,
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
    customerBillItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customerbillitems',
        required: true
    },


}, {
    timestamps: true
});
const Invoice = mongoose.model('Invoices', invoiceSchema);
module.exports = Invoice;
