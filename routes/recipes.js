var express = require('express')
var router = express.Router()
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const recipesCtrl = require('../controllers/recipes')
const ensureLoggedIn = require('../config/ensureLoggedIn')

router.get('/', recipesCtrl.index)
router.get('/add', ensureLoggedIn, recipesCtrl.new)
router.post('/', ensureLoggedIn, upload.single('photo'), recipesCtrl.create)
router.get('/paste', ensureLoggedIn, recipesCtrl.newPasteRecipe)
router.post('/paste', ensureLoggedIn, recipesCtrl.paste)
router.get('/:id', recipesCtrl.show)
router.delete('/:id', ensureLoggedIn, recipesCtrl.delete)
router.post('/:id/collections', ensureLoggedIn, recipesCtrl.addToCollection)
router.get('/:id/edit', ensureLoggedIn, recipesCtrl.editRecipe)
router.put('/:id/update', ensureLoggedIn, recipesCtrl.updateRecipe)

module.exports = router;