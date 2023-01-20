const Collection = require('../models/collection')

module.exports = {
    index,
    new: newCollection,
}

function index(req, res) {
    Collection.find({}, function(err, collections) {
        console.log(collections)
        res.render('collections/index', { collections })
    })
}

function newCollection(req, res) {
    res.render('collections/create')
}

