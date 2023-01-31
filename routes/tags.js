var express = require('express');
var router = express.Router();

const tagsCtrl = require('../controllers/tags')
const ensureLoggedIn = require('../config/ensureLoggedIn');

// router.get('/recipes/:id/ingredients', ensureLoggedIn, ingredientsCtrl.show)
// router.put('/recipes/:id/ingredients', ensureLoggedIn, ingredientsCtrl.create)
// router.delete('/ingredients/:id', ensureLoggedIn, ingredientsCtrl.delete)

module.exports = router;