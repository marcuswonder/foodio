const Collection = require('../models/collection')
const recipe = require('../models/recipe')
const Recipe = require('../models/recipe')

module.exports = {
    index,
    new: newCollection,
    create,
    show,
    delete: deleteCollection,
    removeRecipeFromCollection,
    
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
    if(!req.user) return res.redirect('/auth/google');
    const collection = new Collection(req.body);
    collection.author = req.user._id;
    collection.userName = req.user.name
    collection.gId = req.user.googleId
    collection.save(function(err) {
        if (err) return res.redirect('/collections');
        console.log(err)
        res.render('tags/newcollectiontags', { collection })
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


async function removeRecipeFromCollection(req, res) {
    try {
      const collection = await Collection.findById(req.params.collectionId);
      const idx = collection.recipes.findIndex(r => r._id.toString() === req.params.recipeId);
      collection.recipes.splice(idx, 1);
      await collection.save();
      res.redirect(`/collections/${req.params.collectionId}`);
    } catch (err) {
      console.log(err);
    }
  }