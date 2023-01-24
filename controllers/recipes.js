const Recipe = require('../models/recipe')

module.exports = {
    index,
    new: newRecipe,
    create,
    show,
    showIngredients,
    updateIngredients,
    showInstructions,
    updateInstructions,
    delete: deleteRecipe,
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
        res.redirect(`/recipes/${recipe._id}/ingredients`);
        });
}

function show(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {
        res.render('recipes/show', {title: "Recipe", recipe })
    })
}

function showIngredients(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {
        res.render('recipes/ingredients', { recipe })
    })
}
    
function updateIngredients(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {
        recipe.ingredients.push(req.body);
        recipe.save(function(err) {
            if (err) return res.redirect('/recipes')
            console.log(err)
        // res.redirect(`/recipes/${recipe._id}/ingredients`);
        console.log(req.body)
        res.render('recipes/ingredients', { recipe });
      });
    });
  }

  function showInstructions(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {
        res.render('recipes/instructions', { recipe })
    })
}
    
function updateInstructions(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {
        console.log(req.body)
        recipe.instructions.push(req.body);
        recipe.save(function(err) {
            if (err) return res.redirect('/recipes')
            console.log(err)
        res.render('recipes/instructions', { recipe });
      });
    });
  }


  async function deleteRecipe(req, res, next) {
    console.log("We are in delete")
    try {
        await Recipe.remove({'_id': req.params.id})
        res.redirect('/recipes')
    } catch(err) {
        return next(err)
    }
}
