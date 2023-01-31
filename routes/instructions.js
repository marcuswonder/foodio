var express = require('express');
var router = express.Router();

const instructionsCtrl = require('../controllers/instructions')
const ensureLoggedIn = require('../config/ensureLoggedIn');


router.get('/recipes/:id/instructions', ensureLoggedIn, instructionsCtrl.show)
router.put('/recipes/:id/instructions', ensureLoggedIn, instructionsCtrl.create)
router.delete('/instructions/:id', ensureLoggedIn, instructionsCtrl.delete)

module.exports = router;