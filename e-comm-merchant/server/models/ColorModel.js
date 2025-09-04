const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
    registerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'registers',
        required: true
    },
    color: {
        type: String,
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
    },
}, {
    timestamps: true
});

const Color = mongoose.model('color', colorSchema);
module.exports = Color;