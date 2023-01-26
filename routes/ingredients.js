var express = require('express');
var router = express.Router();

const ingredientsCtrl = require('../controllers/ingredients')

// Routers do not have /ingredients path set
router.get('/recipes/:id/ingredients', ingredientsCtrl.show)
router.get('/recipes/:id/ingredients', ingredientsCtrl.show)
router.put('/recipes/:id/ingredients', ingredientsCtrl.create)
router.delete('/ingredients/:id', ingredientsCtrl.delete)

module.exports = router;