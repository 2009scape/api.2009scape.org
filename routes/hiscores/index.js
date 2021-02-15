var express = require('express');
var router = express.Router();
let config = require("../../config");
let parsers = require("./parsers");
const rankcalculator = require('./rankcalculator');

router.get('/', function (req, res, next) {
  res.json({
    existing_routes: [
      "/hiscores/config",
      "/hiscores/listPlayers/:world",
      "/hiscores/ignoredPlayers",
      "/hiscores/playersByTotal/:world",
      "/hiscores/playersBySkill/:world/:id",
      "/hiscores/playerSkills/:world/:playername",
      "/hiscores/rankedMap/:world",
      "/hiscores/getServerTotalXp/:restrictions",
      "/hiscores/getServerTotalSlayerTasks/:restrictions",
      "/hiscores/getServerTotalAttribute/:attribute",
      "/hiscores/getServerTotalAttribute/:attribute/:restrictions"
    ]
  });
});

router.get('/config', function (req, res, next) {
  res.json(config);
});

router.get('/listPlayers/:world', function (req, res, next) {
  res.json(parsers.playerSaves(Number(req.params.world)));
});

router.get('/ignoredPlayers', function (req, res, next) {
  res.json(parsers.ignoredPlayers());
});

router.get('/playersByTotal/:world', function (req, res, next) {
  res.json(parsers.playersByTotal(Number(req.params.world)));
});

router.get('/playersBySkill/:world/:id', function (req, res, next) {
  res.json(parsers.playersBySkill(Number(req.params.world), req.params.id));
});

router.get('/playerSkills/:world/:playername', function (req, res, next) {
  res.json(parsers.playerSkills(Number(req.params.world), req.params.playername));
});

router.get('/rankedMap/:world', function (req, res, next) {
  res.json(rankcalculator.getRankedMap(Number(req.params.world)));
});

router.get('/getServerTotalXp/:restrictions', function (req, res, next) {
  res.json(parsers.getServerTotalXp(JSON.parse(decodeURI(req.params.restrictions))));
});

router.get('/getServerTotalSlayerTasks/:restrictions', function (req, res, next) {
  res.json(parsers.getServerTotalSlayerTasks(JSON.parse(decodeURI(req.params.restrictions))));
});

router.get('/getServerTotalAttribute/:attribute/', function (req, res, next) {
  res.json(parsers.genericServerTotalAttributeCalculator(req.params.attribute));
});

router.get('/getServerTotalAttribute/:attribute/:restrictions', function (req, res, next) {
  res.json(parsers.genericServerTotalAttributeCalculator(req.params.attribute, JSON.parse(decodeURI(req.params.restrictions))));
});

module.exports = router;
