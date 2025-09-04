const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    
    category: {
        type: String,
        required: true,
    },
    
    status: {
        type: String,
        default: 'active',
        required: true
    },
    

})
const category = mongoose.model('category', categorySchema);
module.exports = category;