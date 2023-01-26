var express = require('express');
var router = express.Router();

const instructionsCtrl = require('../controllers/instructions')

// Routers do not have /instructions path set
router.get('/recipes/:id/instructions', instructionsCtrl.show)
router.get('/recipes/:id/instructions', instructionsCtrl.show)
router.put('/recipes/:id/instructions', instructionsCtrl.create)
router.delete('/instructions/:id', instructionsCtrl.delete)

module.exports = router;