const mongoose = require('mongoose');

const customersSchema = new mongoose.Schema({
    registerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'register',
        required: true,
    },
    customers: {
        type: String,
        required: true,
        trim: true
    },
    contact: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'inactive']
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

const Customers = mongoose.model('customers', customersSchema);
module.exports = Customers;
