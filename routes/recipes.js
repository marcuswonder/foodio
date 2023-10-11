var express = require('express')
var router = express.Router()
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const recipesCtrl = require('../controllers/recipes')
const ensureLoggedIn = require('../config/ensureLoggedIn')

router.get('/', recipesCtrl.index)
router.get('/my-recipes', ensureLoggedIn, recipesCtrl.userIndex)
router.get('/add', ensureLoggedIn, recipesCtrl.new)
router.post('/', ensureLoggedIn, upload.single('photo'), recipesCtrl.create)
router.get('/copy', ensureLoggedIn, recipesCtrl.newCopyRecipe)
router.post('/copy', ensureLoggedIn, recipesCtrl.copy)
router.get('/import', ensureLoggedIn, recipesCtrl.newImportRecipe)
router.post('/import', ensureLoggedIn, recipesCtrl.import)
router.get('/coming-soon', ensureLoggedIn, recipesCtrl.comingSoon)
router.get('/:id', recipesCtrl.show)
router.delete('/:id', ensureLoggedIn, recipesCtrl.delete)
router.post('/:id/collections', ensureLoggedIn, recipesCtrl.addToCollection)
router.get('/:id/edit', ensureLoggedIn, recipesCtrl.editRecipe)
router.put('/:id/update', ensureLoggedIn, upload.single('photo'), recipesCtrl.updateRecipe)

module.exports = router;