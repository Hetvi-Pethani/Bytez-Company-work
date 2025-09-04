const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({

    category: {
        type: String,
        required: true,
    },
    registerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'registers',
    },

    status: {
        type: String,
        default: 'active',
        required: true
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

})
const category = mongoose.model('category', categorySchema);
module.exports = category;