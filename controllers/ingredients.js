const Recipe = require('../models/recipe')

module.exports = {
    show,
    create,
    delete: deleteIngredient,
}

async function show(req, res) {
  try {
      const recipe = await Recipe.findById(req.params.id);
      res.render('recipes/ingredients', { recipe });
      // res.redirect(`recipes/${recipe._id}/ingredients/new`)
  } catch (err) {
      console.log(err);
  }
}


async function create(req, res) {
  console.log(req.body)
  try {
      const recipe = await Recipe.findById(req.params.id);
      recipe.ingredients.push(req.body);
      await recipe.save();
      res.redirect(`/recipes/${recipe._id}/ingredients`);
  } catch (err) {
      if (err) return res.redirect('/recipes');
      console.log(err);
  }
}


async function deleteIngredient(req, res) {
  try {
      const recipe = await Recipe.findOne({ 'ingredients._id': req.params.id });
      const idx = recipe.ingredients.findIndex(i => i._id.toString() === req.params.id);
      recipe.ingredients.splice(idx, 1);
      await recipe.save();
      res.redirect(`/recipes/${recipe._id}/ingredients`);
  } catch (err) {
      console.log(err);
  }
}
