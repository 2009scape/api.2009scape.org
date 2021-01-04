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

let totalPlayersExp = null;
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
            totalPlayersExp += xp; // Used to save calculations in another function
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

function getServerTotalXp() {
    if (totalPlayersExp === null) {
        playersByTotal();
    }
    console.log("Returning " + totalPlayersExp);
    return { total_xp: Math.floor(totalPlayersExp) };
}

/**
 * Loops through every player save file and sums up a variable
 * genericServerTotalCalculator(["slayer", "totalTasks"]) will return the sum of every playerSave["slayer"]["totalTasks"]
 *  i.e. the sum of everyone's total slayer tasks
 * 
 * @param {[String]} details 
 */
function genericServerTotalCalculator(details) {
    sum = 0;
    playerSaves().forEach(player => {
        if (!ignore(player)) {
            stat = JSON.parse(fs.readFileSync(`${config.player_save_path}/${player}.json`, 'utf8'));
            for (let i = 0; i < details.length; i++) {
                stat = stat[`${details[i]}`];
            }
            sum += Number(stat);
        }
    });

    return sum;
}

function getServerTotalSlayerTasks() {
    return { total_tasks: genericServerTotalCalculator(["slayer", "totalTasks"]) };
}

function ignoredPlayers() {
    return ["red_bracket", "ceikry", "mod_woah", "loinmin", "patrick", "unclerob", "rangervaughn", "ohrisk", "mule_2", "callym", "shelly", "dirkjan"];
}

function ignore(playername) {
    return ignoredPlayers().includes(playername);
}

module.exports = { playerSaves, playersBySkill, playerSkills, playersByTotal, getServerTotalXp, getServerTotalSlayerTasks, ignoredPlayers, ignore }
