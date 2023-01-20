const Recipe = require('../models/recipe')

module.exports = {
    index,
    new: newRecipe,
    create,
    show
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
    // not pushing user info to author property on Recipe - check
    req.body.user = req.user._id; 
    req.body.userName = req.user.name;
    req.body.userAvatar = req.user.avatar;

    // Need to figure out how to separate tags and push them to the tags array on recipe object.
    // Need to figure out how to combine ingredient form elements and push them to ingredients array on recipe object.
    // Need to figure out how to combine instruction form elements and push them to instructions array on recipe object.
    const recipe = new Recipe(req.body);
    recipe.save(function(err) {
    if (err) return res.redirect('/recipes/new', { title: "Add Recipe"})
    console.log(recipe);
    res.redirect('/recipes')
    })
}

function show(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {
        res.render('recipes/show', {title: "Recipe", recipe })
    })
}
    
  
  