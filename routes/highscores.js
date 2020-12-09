var express = require('express');
var router = express.Router();
let config = require("../config");

router.get('/', function(req, res, next) {
  res.json({ existing_routes: [
    "/config",
    ""
  ] });
});

router.get('/config', function(req, res, next) {
  res.json(config);
});

module.exports = router;
