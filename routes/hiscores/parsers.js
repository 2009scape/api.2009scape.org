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
    totalPlayersExp = 0;
    beautifulMap = [];
    playerSaves().forEach(player => {
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
                exp_multiplier: playerStats.exp_multiplier,
                iron_mode: playerStats.ironManMode ? playerStats.ironManMode : 0
            });
        }
    });
    return beautifulMap.sort((a, b) => {
        if (b.level - a.level === 0) {
            // Same total - go by XP
            return b.xp - a.xp;
        }
        return b.level - a.level;
    });
}

function playersBySkill(skillid) {
    beautifulMap = [];
    playerSaves().forEach(player => {
        if (!ignore(player)) {
            playerStats = JSON.parse(fs.readFileSync(`${config.player_save_path}/${player}.json`, 'utf8'));
            beautifulMap.push({
                username: player,
                level: Number(playerStats.skills[skillid].static),
                xp: Number(playerStats.skills[skillid].experience),
                exp_multiplier: playerStats.exp_multiplier,
                iron_mode: playerStats.ironManMode ? playerStats.ironManMode : 0
            });
        }
    });
    return beautifulMap.sort((a, b) => b.xp - a.xp);
}

function playerSkills(playername) {
    playerStats = JSON.parse(fs.readFileSync(`${config.player_save_path}/${playername}.json`, 'utf8'));
    return {
        skills: playerStats.skills,
        info: {
            exp_multiplier: playerStats.exp_multiplier,
            iron_mode: playerStats.ironManMode ? playerStats.ironManMode : "0"
        }
    };
}

/**
 * Loops through every player save file and sums up a variable
 * genericServerTotalCalculator(["slayer", "totalTasks"]) will return the sum of every playerSave["slayer"]["totalTasks"]
 *  i.e. the sum of everyone's total slayer tasks
 * 
 * @param {[String]} details 
 * @param {Object} restrictions - filter to provide (i.e only ironmen)
 */
function genericServerTotalCalculator(details, restrictions) {
    sum = 0;
    playerSaves().forEach(player => {
        if (!ignore(player)) {
            stat = JSON.parse(fs.readFileSync(`${config.player_save_path}/${player}.json`, 'utf8'));

            // (Optional) check for restrictions
            if (restrictions) {
                if (restrictions.ironManMode && restrictions.ironManMode.length >= 1 && !restrictions.ironManMode.includes(stat.ironManMode)) {
                    return;
                }
                if (restrictions.exp_multiplier && restrictions.exp_multiplier > Number(stat.exp_multiplier)) {
                    return;
                }
            }
            for (let i = 0; i < details.length; i++) {
                stat = stat[`${details[i]}`];
            }
            sum += Number(stat);
        }
    });

    return sum;
}

function getServerTotalXp(restrictions) {
    total_xp = 0;
    for (let i = 0; i < 24; i++) {
        total_xp += Number(genericServerTotalCalculator(["skills", `${i}`, "experience"], restrictions));
    }
    return { total_xp };
}

function getServerTotalSlayerTasks(restrictions) {
    return { total_tasks: genericServerTotalCalculator(["slayer", "totalTasks"], restrictions) };
}

function ignoredPlayers() {
    return ["red_bracket", "ceikry", "mod_woah", "loinmin", "patrick", "unclerob", "rangervaughn", "ohrisk", "mule_2", "callym", "shelly", "dirkjan"];
}

function ignore(playername) {
    return ignoredPlayers().includes(playername);
}

module.exports = { playerSaves, playersBySkill, playerSkills, playersByTotal, getServerTotalXp, getServerTotalSlayerTasks, ignoredPlayers, ignore }
