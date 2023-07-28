const Recipe = require('../models/recipe')

module.exports = {
    show,
    create,
    delete: deleteInstruction,
}

async function show(req, res) {
  const recipe = await Recipe.findById(req.params.id);
  res.render('recipes/instructions', { recipe });
}

async function create(req, res) {
  try {
    const recipe = await Recipe.findById(req.params.id);
    recipe.instructions.push(req.body);
    await recipe.save();
    res.redirect(`/recipes/${recipe._id}/instructions`);
  } catch (err) {
    console.log(err);
    res.redirect('/recipes');
  }
}

async function deleteInstruction(req, res) {
  try {
    const recipe = await Recipe.findOne({'instructions._id': req.params.id});
    const idx = recipe.instructions.findIndex(i => i._id.toString() === req.params.id);
    recipe.instructions.splice(idx, 1);
    await recipe.save();
    res.redirect(`/recipes/${recipe._id}/instructions`);
  } catch (err) {
    console.log(err);
  }
}

  