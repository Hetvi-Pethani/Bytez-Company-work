const mongoose = require("mongoose");

const invoicePrintSchema = new mongoose.Schema(
    {
        customerBillId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'customerbills',
            required: true,
        },
        customerBillItemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'customerbillitems',
            required: true
        },

        registerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'register',
            required: true,
        },
        // printedBy: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "register", 
        //     required: true,
        // },
        // printedAt: {
        //     type: Date,
        //     default: Date.now,
        // },
        // printNotes: {
        //     type: String,
        //     default: "",
        // },
        // status: {
        //     type: String,
        //     enum: ["active", "archived"],
        //     default: "active",
        // },
    },
    { timestamps: true }
);

const InvoicePrint = mongoose.model('InvoicePrint', invoicePrintSchema);
module.exports = InvoicePrint;