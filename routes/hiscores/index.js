var express = require('express');
var router = express.Router();
let config = require("../../config");
let parsers = require("./parsers");
const rankedMap = require('./rankcalculator');

router.get('/', function (req, res, next) {
  res.json({
    existing_routes: [
      "/hiscores/config",
      "/hiscores/listPlayers",
      "/hiscores/ignoredPlayers",
      "/hiscores/playersByTotal",
      "/hiscores/playersBySkill/:id",
      "/hiscores/playerSkills/:playername",
      "/hiscores/rankedMap",
      "/hiscores/getServerTotalXp/:restrictions",
      "/hiscores/getServerTotalSlayerTasks/:restrictions"
    ]
  });
});

router.get('/config', function (req, res, next) {
  res.json(config);
});

router.get('/listPlayers', function (req, res, next) {
  res.json(parsers.playerSaves());
});

router.get('/ignoredPlayers', function (req, res, next) {
  res.json(parsers.ignoredPlayers());
});

router.get('/playersByTotal', function (req, res, next) {
  res.json(parsers.playersByTotal());
});

router.get('/playersBySkill/:id', function (req, res, next) {
  res.json(parsers.playersBySkill(req.params.id));
});

router.get('/playerSkills/:playername', function (req, res, next) {
  res.json(parsers.playerSkills(req.params.playername));
});

router.get('/rankedMap', function (req, res, next) {
  res.json(rankedMap);
});

router.get('/getServerTotalXp/:restrictions', function (req, res, next) {
  res.json(parsers.getServerTotalXp(JSON.parse(decodeURI(req.params.restrictions))));
});

router.get('/getServerTotalSlayerTasks/:restrictions', function (req, res, next) {
  res.json(parsers.getServerTotalSlayerTasks(JSON.parse(decodeURI(req.params.restrictions))));
});

module.exports = router;
