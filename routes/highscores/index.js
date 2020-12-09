var express = require('express');
var router = express.Router();
let config = require("../../config");
let parsers = require("./parsers");

router.get('/', function(req, res, next) {
  res.json({ existing_routes: [
    "/config",
    "/listPlayers",
    "/getPlayersByTotal",
    "/playersBySkill/:id",
    "/playerSkills/:playername"
  ] });
});

router.get('/config', function(req, res, next) {
    res.json(config);
  });

router.get('/listPlayers', function(req, res, next) {
  res.json(parsers.playerSaves());
});

router.get('/getPlayersByTotal', function(req, res, next) {
  res.json(parsers.getPlayersByTotal());
});

router.get('/playersBySkill/:id', function(req, res, next) {
  res.json(parsers.getPlayersBySkill(req.params.id));
});
  
router.get('/playerSkills/:playername', function(req, res, next) {
  res.json(parsers.getPlayerSkills(req.params.playername));
});
  
module.exports = router;
