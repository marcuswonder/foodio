var express = require('express');
var router = express.Router();

const collectionsCtrl = require('../controllers/collections')

router.get('/', collectionsCtrl.index)
router.get('/create', collectionsCtrl.new)

module.exports = router;