const mongoose = require('mongoose');

const ShopproductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    features: {
        type: [String],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    imageSrc: {
        type: String,
        required: true
    },
    imagename: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 4.0
    },
    reviews: {
        type: Number,
        default: 0
    },
    stock: {
        type: String,
        default: 'In stock'
    },
    delivery: {
        type: String,
        default: 'FREE delivery by Tomorrow'
    }
}, {
    timestamps: true
});

module.exports = shopproduct = mongoose.model('shopproduct', ShopproductSchema);
