const config = require("../../config");
const fs = require('fs');

/**
 * Gets all the player usernames on 2009scape
 * 
 */
function playerSaves() {
    players = [];
    fs.readdirSync(config.player_save_path).forEach(file => {
        if (file.endsWith(".json") && !ignore(file.split(".")[0])) {
            players.push(file.split(".")[0]);
        }
    });
    return players;
}

function playersByTotal() {
    beautifulMap = [];
    playerSaves(true).forEach(player => {
        if (!ignore(player)) {
            playerStats = JSON.parse(fs.readFileSync(`${config.player_save_path}/${player}.json`, 'utf8'));
            level = 0;
            xp = 0;
            playerStats.skills.forEach(skill => {
                level += Number(skill.static);
                xp += Number(skill.experience);
            });
            beautifulMap.push({
                username: player,
                level,
                xp,
                exp_multiplier: player.exp_multiplier,
                iron_mode: player.ironManMode ? player.ironManMode : 0
            });
        }
    });
    return beautifulMap.sort((a, b) => b.level - a.level);
}

function playersBySkill(skillid) {
    beautifulMap = [];
    playerSaves(true).forEach(player => {
        if (!ignore(player)) {
            playerStats = JSON.parse(fs.readFileSync(`${config.player_save_path}/${player}.json`, 'utf8'));
            beautifulMap.push({
                username: player,
                level: Number(playerStats.skills[skillid].static),
                xp: Number(playerStats.skills[skillid].experience),
                exp_multiplier: player.exp_multiplier,
                iron_mode: player.ironManMode ? player.ironManMode : 0
            });
        }
    });
    return beautifulMap.sort((a, b) => b.level - a.level);
}

function playerSkills(playername) {
    playerStats = JSON.parse(fs.readFileSync(`${config.player_save_path}/${playername}.json`, 'utf8'));
    return {
        skills: playerStats.skills,
        info: {
            exp_multiplier: player.exp_multiplier,
            iron_mode: player.ironManMode ? player.ironManMode : 0
        }
    };
}

function ignoredPlayers() {
    return ["red_bracket", "ceikry", "startsWith mod_"];
}

function ignore(playername) {
    return playername === "red_bracket" ||
        playername === "ceikry" ||
        playername.startsWith("mod_");
}

module.exports = { playerSaves, playersBySkill, playerSkills, playersByTotal, ignoredPlayers }