var express = require('express');
var router = express.Router();

const recipesCtrl = require('../controllers/recipes')

router.get('/', recipesCtrl.index)
router.get('/add', recipesCtrl.new)
router.post('/', recipesCtrl.create)
router.get('/:id', recipesCtrl.show)
router.get('/:id/ingredients', recipesCtrl.showIngredients)
router.put('/:id/ingredients', recipesCtrl.updateIngredients)
router.get('/:id/instructions', recipesCtrl.showInstructions)
router.put('/:id/instructions', recipesCtrl.updateInstructions)
router.delete('/:id', recipesCtrl.delete)
router.post('/:id/collections', recipesCtrl.addToCollection)
router.get('/:id/edit', recipesCtrl.update)

module.exports = router;