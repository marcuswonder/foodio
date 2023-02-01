var express = require('express');
var router = express.Router();

const tagsCtrl = require('../controllers/tags')
const ensureLoggedIn = require('../config/ensureLoggedIn');

router.get('/recipes/:id/tags', ensureLoggedIn, tagsCtrl.newRecipeTag)
router.post('/recipes/:id/tags', ensureLoggedIn, tagsCtrl.create)
router.get('/collections/:id/tags', ensureLoggedIn, tagsCtrl.newCollectionTag)
// router.delete('/ingredients/:id', ensureLoggedIn, tagsCtrl.delete)

module.exports = router;