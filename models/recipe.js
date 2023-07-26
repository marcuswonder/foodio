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
        ref: 'User',
        required: true,
    },
    ingredients: [{
        ingredient: { type: String },
        qty: { type: Number },
        unit: { type: String },
        preparation: { type: String }
    }],
    instructions: [{
        instruction: {
            type: String}
    }],
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    photo: String,
    userName: String,
    gId: String,
}, {
    timestamps: true
});

module.exports = mongoose.model('Recipe', recipeSchema)
