const Recipe = require('../models/recipe')

module.exports = {
    show,
    create,
    delete: deleteIngredient,
}

function show(req, res) {
    console.log("Ingredients show is being hit")
    Recipe.findById(req.params.id, function(err, recipe) {
        res.render('recipes/ingredients', { recipe })
        // res.redirect(`recipes/${recipe._id}/ingredients/new`)
    })
}


function create(req, res) {
    console.log("Create Ingredients being hit!")
    console.log(req.body)
    Recipe.findById(req.params.id, function(err, recipe) {
        recipe.ingredients.push(req.body);
        recipe.save(function(err) {
            if (err) return res.redirect('/recipes')
            console.log(err)
        // res.render('recipes/ingredients', { recipe });
        res.render('recipes/ingredients', { recipe })
      });
    });
  }

async function deleteIngredient(req, res, next) {
    try {
        const recipe = await Recipe.findOne({'ingredients._id': req.params.id})
        if(!recipe) return res.redirect('/recipes')
        recipe.ingredients.remove(req.params.id)
        await recipe.save
        res.redirect(`recipes/${recipe._id}`)
        // res.render('recipes/ingredients', { recipe })
    } catch(err) {
        return next(err)
    }
    
    
  }

