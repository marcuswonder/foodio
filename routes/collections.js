var express = require('express');
var router = express.Router();

const collectionsCtrl = require('../controllers/collections')

router.get('/', collectionsCtrl.index)
router.get('/', collectionsCtrl.new)
router.post('/create', collectionsCtrl.create)

module.exports = router;