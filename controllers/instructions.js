const Recipe = require('../models/recipe')

module.exports = {
    show,
    create,
    delete: deleteInstruction,
}

function show(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {
        res.render('recipes/instructions', { recipe })
    })
}

function create(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {
        recipe.instructions.push(req.body);
        recipe.save(function(err) {
            if (err) return res.redirect('/recipes')
            console.log(err)
        res.redirect(`/recipes/${recipe._id}/instructions`);
      });
    });
  }

  async function deleteInstruction(req, res) {
    try {
      const recipe = await Recipe.findOne({'instruction._id': req.params.id});
      const idx = recipe.instructions.findIndex(i => i._id.toString() === req.params.id);
      recipe.instructions.splice(idx, 1);
      await recipe.save();
      res.redirect(`/recipes/${recipe._id}/instructions`);
    } catch (err) {
      console.log(err);
    }
  }

  