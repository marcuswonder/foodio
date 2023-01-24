const Collection = require('../models/collection')

module.exports = {
    index,
    new: newCollection,
    create,
    show,
    delete: deleteCollection,
}

function index(req, res) {
    Collection.find({}, function(err, collections) {
        res.render('collections/index', { collections })
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
    collection.gId = req.user.googleId
    collection.save(function(err) {
        if (err) return res.redirect('/collections');
        console.log(err)
        // res.redirect(`/collections/${collection._id}`);
        res.render('collections/index', { collection })
        });
}

function show(req, res) {
    Collection.findById(req.params.id, function(err, collection) {
        res.render('collections/show', { collection })
    })
}

async function deleteCollection(req, res, next) {
    console.log("We are in delete")
    try {
        await Collection.remove({'_id': req.params.id})
        res.redirect('/collections')
    } catch(err) {
        return next(err)
    }
}