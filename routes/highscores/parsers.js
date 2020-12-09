const config = require("../../config");
const fs = require('fs');

/**
 * Gets all the player usernames on 2009scape
 * 
 */
function playerSaves() {
    players = [];
    fs.readdirSync(config.player_save_path).forEach(file => {
        if (file.endsWith(".json")) {
            players.push(file.split(".")[0]);
        }
    });
    return players;
}

function getPlayersBySkill(skillid) {
    beautifulMap = [];
    playerSaves(true).forEach(player => {
        playerStats = JSON.parse(fs.readFileSync(`${config.player_save_path}/${player}.json`, 'utf8'));
        beautifulMap.push({
            username: player,
            level: Number(playerStats.skills[skillid].static),
            xp: Number(playerStats.skills[skillid].experience)
        });
    });
    return beautifulMap.sort((a, b) => b.level - a.level);
}

function getPlayerSkills(playername) {
    playerStats = JSON.parse(fs.readFileSync(`${config.player_save_path}/${playername}.json`, 'utf8'));
    return playerStats.skills;
}

module.exports = { playerSaves, getPlayersBySkill, getPlayerSkills }