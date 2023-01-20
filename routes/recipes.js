var express = require('express');
var router = express.Router();

const recipesCtrl = require('../controllers/recipes')

router.get('/', recipesCtrl.index)
router.get('/add', recipesCtrl.new)
router.post('/', recipesCtrl.create)
router.get('/:id', recipesCtrl.show)

module.exports = router;