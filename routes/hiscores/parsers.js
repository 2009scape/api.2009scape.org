const config = require("../../config");
const fs = require('fs');

/**
 * Gets all the player usernames on 2009scape
 * 
 */
function playerSaves(world) {
    players = [];
    fs.readdirSync(world === 1 ? config.world1_save_path : config.world2_save_path).forEach(file => {
        if (file.endsWith(".json") && !ignore(file.split(".")[0])) {
            players.push(file.split(".")[0]);
        }
    });
    return players;
}

function playersByTotal(world) {
    totalPlayersExp = 0;
    beautifulMap = [];
    playerSaves(world).forEach(player => {
        playerStats = JSON.parse(fs.readFileSync(`${world === 1 ? config.world1_save_path : config.world2_save_path}/${player}.json`, 'utf8'));
        if (!ignore(player, playerStats)) {
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

function playersBySkill(world, skillid) {
    beautifulMap = [];
    playerSaves(world).forEach(player => {
        playerStats = JSON.parse(fs.readFileSync(`${world === 1 ? config.world1_save_path : config.world2_save_path}/${player}.json`, 'utf8'));
        if (!ignore(player, playerStats)) {
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

function playerSkills(world, playername) {
    playerStats = JSON.parse(fs.readFileSync(`${world === 1 ? config.world1_save_path : config.world2_save_path}/${playername}.json`, 'utf8'));
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
function genericServerTotalCalculator(world, details, restrictions) {
    sum = 0;
    playerSaves(world).forEach(player => {
        stat = JSON.parse(fs.readFileSync(`${world === 1 ? config.world1_save_path : config.world2_save_path}/${player}.json`, 'utf8'));
        if (!ignore(player, stat)) {

            // (Optional) check for restrictions
            if (restrictions) {
                if (restrictions.ironManMode && restrictions.ironManMode.length >= 1) {
                    // Filter out based on ironmen filter, unless filter is set and no ironmen are ticked, in which case only show non-ironmen
                    if (!restrictions.ironManMode.includes(stat.ironManMode) && !(!stat.ironManMode && JSON.stringify(restrictions.ironManMode) === JSON.stringify(['0', '0', '0']))) {
                        return;
                    }
                }
                if (restrictions.exp_multiplier && Number(stat.exp_multiplier) > Number(restrictions.exp_multiplier)) {
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

function getWorldTotalXp(world, restrictions) {
    total_xp = 0;
    for (let i = 0; i < 24; i++) {
        total_xp += Number(genericServerTotalCalculator(world, ["skills", `${i}`, "experience"], restrictions));
    }
    return { total_xp };
}

function getWorldTotalSlayerTasks(world, restrictions) {
    return { total_tasks: genericServerTotalCalculator(world, ["slayer", "totalTasks"], restrictions) };
}

function genericServerTotalAttributeCalculator(world, attribute, restrictions) {
    sum = 0;
    playerSaves(world).forEach(player => {
        stat = JSON.parse(fs.readFileSync(`${world === 1 ? config.world1_save_path : config.world2_save_path}/${player}.json`, 'utf8'));
        if (!ignore(player, stat)) {

            // (Optional) check for restrictions
            if (restrictions) {
                if (restrictions.ironManMode && restrictions.ironManMode.length >= 1) {
                    // Filter out based on ironmen filter, unless filter is set and no ironmen are ticked, in which case only show non-ironmen
                    if (!restrictions.ironManMode.includes(stat.ironManMode) && !(!stat.ironManMode && JSON.stringify(restrictions.ironManMode) === JSON.stringify(['0', '0', '0']))) {
                        return;
                    }
                }
                if (restrictions.exp_multiplier && Number(stat.exp_multiplier) > Number(restrictions.exp_multiplier)) {
                    return;
                }
            }

            if (stat.attributes) {
                stat.attributes.forEach(attr => {
                    if (attr.key === `stats_manager:${attribute}`) {
                        sum += Number(attr.value);
                    }
                });
            }
        }
    });

    return { sum };
}

function ignoredPlayers() {
    return ["red_bracket", "ceikry", "mod_woah", "loinmin", "patrick", "unclerob", "rangervaughn", "ohrisk", "mule_2", "callym", "shelly", "dirkjan", "webbing10", "nijouh", "kermit"];
}

function ignore(playername, playerfile) {
    return ignoredPlayers().includes(playername) || playerfile && playerfile.attributes && playerfile.attributes.find(attr => attr.key === "not_on_hiscores");
}

module.exports = {
    playerSaves,
    playersBySkill,
    playerSkills,
    playersByTotal,
    getWorldTotalXp,
    getWorldTotalSlayerTasks,
    genericServerTotalAttributeCalculator,
    ignoredPlayers,
    ignore
}
