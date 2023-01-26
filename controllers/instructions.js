const Recipe = require('../models/recipe')
const Collection = require('../models/collection')

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
        res.render('recipes/instructions', { recipe });
      });
    });
  }

  function deleteInstruction(req, res) {

  }