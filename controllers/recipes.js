const Recipe = require('../models/recipe')
const Collection = require('../models/collection')

module.exports = {
    index,
    new: newRecipe,
    create,
    show,
    delete: deleteRecipe,
    addToCollection,
    editRecipe,
    updateRecipe,
    // editRecipeIngredients,
    // editRecipeInstructions,
}

function index(req, res) {
    Recipe.find({}, function(err, recipes) {
        res.render('recipes/index', { recipes })
    })
}

function newRecipe(req, res) {
    res.render('recipes/new')
}


function create(req, res) {
    if(!req.user) return res.redirect('/users/login');
    const recipe = new Recipe(req.body);
    recipe.author = req.user._id;
    recipe.userName = req.user.name
    recipe.gId = req.user.googleId
    recipe.save(function(err) {
        if (err) return res.redirect('/recipes');
        console.log(err)
        console.log("Recipe create redirect hit!")
        res.redirect(`/recipes/${recipe._id}`);
        });
}

function show(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {
        Collection.find({}, function(err, collections) {
        res.render('recipes/show', { recipe, collections })
        })
    })
}
    


  async function deleteRecipe(req, res, next) {
    try {
        await Recipe.remove({'_id': req.params.id})
        res.redirect('/recipes')
    } catch(err) {
        return next(err)
    }
}

function addToCollection(req, res) {
    console.log("I'm hit!")
    console.log(req.params) // Recipe 
    console.log(req.body.collection_id) // Collection
    Collection.findById(req.body.collection_id, function(err, collection) {
        collection.recipes.push(req.params.id);
        collection.save()
        res.redirect(`/recipes/${req.params.id}`);
    })
}

function editRecipe(req, res) {
    console.log("Edit Recipe is being hit")
    Recipe.findById(req.params.id, function(err, recipe) {
        res.render('recipes/update', { recipe })
    })
}

function updateRecipe(req, res) {
    console.log("Edit Recipe being hit!")
    console.log(req.body)
    Recipe.findById(req.params.id, function(err, recipe) {
        recipe.name = req.body.name
        recipe.description = req.body.description
        recipe.prepTime = req.body.prepTime
        recipe.cookTime = req.body.cookTime
        recipe.category = req.body.category
        recipe.servings = req.body.servings
        recipe.save()
        res.redirect(`/recipes/${req.params.id}`)
    })
}
