var express = require('express');
var router = express.Router();
let config = require("../../config");
let parsers = require("./parsers");

router.get('/', function(req, res, next) {
  res.json({ existing_routes: [
    "/config",
    "/list_players",
    "/playersBySkill/:id",
    "/playerSkills/:playername"
  ] });
});

router.get('/config', function(req, res, next) {
    res.json(config);
  });

router.get('/list_players', function(req, res, next) {
  res.json(parsers.playerSaves());
});

router.get('/playersBySkill/:id', function(req, res, next) {
  res.json(parsers.getPlayersBySkill(req.params.id));
});
  
router.get('/playerSkills/:playername', function(req, res, next) {
  res.json(parsers.getPlayerSkills(req.params.playername));
});
  
module.exports = router;
