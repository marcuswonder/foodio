const Collection = require('../models/collection')
const Recipe = require('../models/recipe')

module.exports = {
    index,
    new: newCollection,
    create,
    show,
    delete: deleteCollection,
    deleteRecipeFromCollection,
    
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
    console.log("Create Collections being hit!")
    console.log(req.body)
    console.log(req.user)
    if(!req.user) return res.redirect('/auth/google');
    const collection = new Collection(req.body);
    collection.author = req.user._id;
    collection.userName = req.user.name
    collection.gId = req.user.googleId
    collection.save(function(err) {
        if (err) return res.redirect('/collections');
        console.log(err)
        Collection.find({}, function(err, collections) {
            res.render('collections/index', { collections })
        });
    })
}

function show(req, res) {
    Collection.findById(req.params.id)
        .populate("recipes")
        .exec(function(err, collection) {
            Recipe.find({ _id: {$nin: collection.recipes } }, function(err, recipes) {
                res.render('collections/show', { collection, recipes })
        })
    })
}

async function deleteCollection(req, res, next) {
    try {
        await Collection.remove({'_id': req.params.id})
        res.redirect('/collections')
    } catch(err) {
        return next(err)
    }
}

function deleteRecipeFromCollection(req, res) {

    }
