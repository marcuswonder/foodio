const Collection = require('../models/collection')
const recipe = require('../models/recipe')
const Recipe = require('../models/recipe')

module.exports = {
    index,
    userIndex,
    new: newCollection,
    create,
    show,
    delete: deleteCollection,
    removeRecipeFromCollection,
    
}

async function index(req, res) {
    try {
        const collections = await Collection.find({});
        res.render('collections/index', { collections,  stylesheet: '../public/stylesheets/collectionsIndex.css' });
    } catch (err) {
        console.log(err);
    }
}

async function userIndex(req, res) {
    console.log("Collection Controller: userIndex Hit")
    console.log("Collection Controller: userIndex req.user", req.user)
    console.log("Collection Controller: userIndex req.user._id", req.user._id)
    try {
        const collections = await Collection.find({ 'author': req.user._id });
        res.render('collections/index', { collections,  stylesheet: '../public/stylesheets/collectionsIndex.css' });
    } catch (err) {
        console.log(err);
    }
}

function newCollection(req, res) {
    res.render('collections/create', { stylesheet: '../public/stylesheets/collectionsCreate.css' });
}

async function index(req, res) {
    try {
        const collections = await Collection.find({});
        res.render('collections/index', { collections,  stylesheet: '../public/stylesheets/collectionsIndex.css' });
    } catch (err) {
        console.log(err);
    }
}

function newCollection(req, res) {
    res.render('collections/create', { stylesheet: '../public/stylesheets/collectionsCreate.css' });
}

async function create(req, res) {
    try {
        if (!req.user) return res.redirect('/auth/google');
        const collection = new Collection(req.body);
        collection.author = req.user._id;
        collection.userName = req.user.name;
        collection.gId = req.user.googleId;
        await collection.save();
        res.redirect(`/collections/${collection._id}`);
    } catch (err) {
        console.log(err);
        res.redirect('/collections');
    }
}

async function show(req, res) {
    try {
        const collection = await Collection.findById(req.params.id).populate("recipes").exec();
        const recipes = await Recipe.find({ _id: { $nin: collection.recipes } });
        res.render('collections/show', { collection, recipes, stylesheet: '../public/stylesheets/collectionShow.css' });
    } catch (err) {
        console.log(err);
    }
}

async function deleteCollection(req, res, next) {
    try {
        await Collection.deleteOne({ '_id': req.params.id });
        res.redirect('/collections');
    } catch (err) {
        return next(err);
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