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
        // res.render('recipes/ingredients', { recipe })
        res.redirect(`/recipes/${recipe._id}/ingredients`);
      });
    });
  }


async function deleteIngredient(req, res) {
  try {
    const recipe = await Recipe.findOne({'ingredients._id': req.params.id});
    const idx = recipe.ingredients.findIndex(i => i._id.toString() === req.params.id);
    recipe.ingredients.splice(idx, 1);
    await recipe.save();
    res.redirect(`/recipes/${recipe._id}/ingredients`);
  } catch (err) {
    console.log(err);
  }
}
