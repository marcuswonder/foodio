var express = require('express');
var router = express.Router();

const collectionsCtrl = require('../controllers/collections')
const ensureLoggedIn = require('../config/ensureLoggedIn');

router.get('/', collectionsCtrl.index)
router.get('/create', ensureLoggedIn, collectionsCtrl.new)
router.post('/', ensureLoggedIn, collectionsCtrl.create)
router.get('/:id', collectionsCtrl.show)
router.delete('/:id', ensureLoggedIn, collectionsCtrl.delete)
// router.put('/:collectionId/remove/:recipeId', ensureLoggedIn, collectionsCtrl.removeRecipeFromCollection)

module.exports = router;