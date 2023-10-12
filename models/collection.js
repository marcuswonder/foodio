const mongoose = require('mongoose');
const Schema = mongoose.Schema

const collectionsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    userName: String,
    gId: String,
    recipes: [{
        type: Schema.Types.ObjectId,
        ref: 'Recipe'
    }],
    photo: String,
}, {
    timestamps: true
})

module.exports = mongoose.model('Collection', collectionsSchema)