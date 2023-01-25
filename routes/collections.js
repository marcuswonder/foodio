var express = require('express');
var router = express.Router();

const collectionsCtrl = require('../controllers/collections')

router.get('/', collectionsCtrl.index)
router.get('/create', collectionsCtrl.new)
router.post('/', collectionsCtrl.create)
router.get('/:id', collectionsCtrl.show)
router.delete('/:id', collectionsCtrl.delete)
router.put('/:collectionId/delete/:recipeId/', collectionsCtrl.deleteRecipeFromCollection)

module.exports = router;