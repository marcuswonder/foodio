var express = require('express');
var router = express.Router();

const recipesCtrl = require('../controllers/recipes')

router.get('/', recipesCtrl.index)
router.get('/add', recipesCtrl.new)
router.post('/', recipesCtrl.create)
router.get('/:id', recipesCtrl.show)
router.delete('/:id', recipesCtrl.delete)
router.post('/:id/collections', recipesCtrl.addToCollection)
router.get('/:id/edit', recipesCtrl.editRecipe)
router.put('/:id/update', recipesCtrl.updateRecipe)




module.exports = router;