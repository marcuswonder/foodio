const mongoose = require('mongoose');
const Schema = mongoose.Schema
const { recipeSchema } = require('./recipe')

const collectionsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    tags: {
        type: [String]
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    userName: String,
    recipes: [recipeSchema]
}, {
    timestamps: true
})

module.exports = mongoose.model('Collection', collectionsSchema)