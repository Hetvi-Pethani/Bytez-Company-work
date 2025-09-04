const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema({

    registerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'registers',
        required: true
    },
    size: {
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
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});


const Size = mongoose.model('size', sizeSchema);
module.exports = Size;