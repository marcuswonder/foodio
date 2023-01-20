const mongoose = require('mongoose');
const Schema = mongoose.Schema

const recipeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    category: {
        type: String
    },
    tags: {
        type: [String],
        required: true
    },
    nationality: {
        type: [String]
    },
    prepTime: {
        type: Number,
        min: 0,
        max: 1000
    },
    cookTime: {
        type: Number,
        min: 0,
        max: 1000
    },
    servings: {
        type: Number,
        min: 1,
        max: 24
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    ingredients: [{
            name: { type: String },
            qty: { type: Number },
            unit: { type: String }
        }],
    instructions: {
        type: [String],
        required: true,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Recipe', recipeSchema)
module.exports.recipeSchema = recipeSchema