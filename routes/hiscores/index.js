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
      "/hiscores/getWorldTotalXp/:world/:restrictions",
      "/hiscores/getWorldTotalSlayerTasks/:world/:restrictions",
      "/hiscores/getWorldTotalAttribute/:world/:attribute",
      "/hiscores/getWorldTotalAttribute/:world/:attribute/:restrictions"
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

router.get('/getWorldTotalXp/:world/:restrictions', function (req, res, next) {
  res.json(parsers.getWorldTotalXp(Number(req.params.world), JSON.parse(decodeURI(req.params.restrictions))));
});

router.get('/getWorldTotalSlayerTasks/:world/:restrictions', function (req, res, next) {
  res.json(parsers.getWorldTotalSlayerTasks(Number(req.params.world), JSON.parse(decodeURI(req.params.restrictions))));
});

router.get('/getWorldTotalAttribute/:world/:attribute/', function (req, res, next) {
  res.json(parsers.genericServerTotalAttributeCalculator(Number(req.params.world), req.params.attribute));
});

router.get('/getWorldTotalAttribute/:world/:attribute/:restrictions', function (req, res, next) {
  res.json(parsers.genericServerTotalAttributeCalculator(Number(req.params.world), req.params.attribute, JSON.parse(decodeURI(req.params.restrictions))));
});

module.exports = router;
