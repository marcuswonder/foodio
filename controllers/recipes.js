const Recipe = require('../models/recipe')

module.exports = {
    index,
}

function index() {
    Recipe.find({}, function(err, recipes) {
        console.log(recipes)
        res.render('recipes', { recipes })
    })
}

