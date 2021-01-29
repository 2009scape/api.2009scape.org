const config = require("../../config");
let parsers = require("./parsers");
const fs = require('fs');

function createRankMap() {
    console.log("Creating ranked map...");

    skills = [];
    for (let i = 0; i < 24; i++) {
        skills[i] = [];
    }

    parsers.playerSaves().forEach(player => {
        playerStats = JSON.parse(fs.readFileSync(`${config.player_save_path}/${player}.json`, 'utf8'));
        if (!parsers.ignore(player, playerStats)) {

            playerStats.skills.forEach((skill, index) => {
                skills[index].push({
                    username: player,
                    xp: Number(skill.experience),
                    exp_multiplier: playerStats.exp_multiplier,
                    iron_mode: playerStats.ironManMode ? playerStats.ironManMode : 0
                })
            });
        }
    });

    skills.forEach(skill => {
        skill.sort((a, b) => b.xp - a.xp);
    });

    // View size of map
    // Send entire map over
    // Filter out the iron modes/exp not wanted
    // Find your index to know your rank
    console.log("Done");
    return skills;
}

module.exports = createRankMap();