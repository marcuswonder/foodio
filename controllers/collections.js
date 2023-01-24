const Collection = require('../models/collection')

module.exports = {
    index,
    new: newCollection,
    create,
}

function index(req, res) {
    Collection.find({}, function(err, collections) {
        console.log(collections)
        res.render('collections/index', { title: "Collections", collections })
    })
}

function newCollection(req, res) {
    res.render('collections/create')
}

function create(req, res) {
    if(!req.user) return res.redirect('/users/login');
    const collection = new Collection(req.body);
    collection.author = req.user._id;
    collection.userName = req.user.name
    collection.save(function(err) {
        if (err) return res.redirect('/collections');
        console.log(err)
        res.redirect(`/collections/${collection._id}`);
        res.render('/collections')
        });
}