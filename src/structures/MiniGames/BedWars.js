const divide = require('../../utils/divide');

const generateStatsForMode = (data, mode) => {
  return {
    winstreak: data[`${mode}_winstreak`] || 0,
    playedGames: data[`${mode}_games_played_bedwars`] || 0,

    kills: data[`${mode}_kills_bedwars`] || 0,
    deaths: data[`${mode}_deaths_bedwars`] || 0,

    wins: data[`${mode}_wins_bedwars`] || 0,
    losses: data[`${mode}_losses_bedwars`] || 0,

    finalKills: data[`${mode}_final_kills_bedwars`] || 0,
    finalDeaths: data[`${mode}_final_deaths_bedwars`] || 0,

    beds: {
      broken: data[`${mode}_beds_broken_bedwars`] || 0,
      lost: data[`${mode}_beds_lost_bedwars`] || 0,
      BLRatio: divide(data[`${mode}_beds_broken_bedwars`], data[`${mode}_beds_lost_bedwars`])
    },

    avg: {
      kills: divide(data[`${mode}_kills_bedwars`], data[`${mode}_games_played_bedwars`]),
      finalKills: divide(data[`${mode}_final_kills_bedwars`], data[`${mode}_games_played_bedwars`]),
      bedsBroken: divide(data[`${mode}_beds_broken_bedwars`], data[`${mode}_games_played_bedwars`])
    },

    KDRatio: divide(data[`${mode}_kills_bedwars`], data[`${mode}_deaths_bedwars`]),
    WLRatio: divide(data[`${mode}_wins_bedwars`], data[`${mode}_losses_bedwars`]),
    finalKDRatio: divide(data[`${mode}_final_kills_bedwars`], data[`${mode}_final_deaths_bedwars`])
  };
};

/**
 * BedWars class
 */
class BedWars {
  /**
   * @param {object} data BedWars data
   */
  constructor (data) {
    /**
     * Coins
     * @type {number}
     */
    this.coins = data.coins || 0;
    /**
     * Experience
     * @type {number}
     */
    this.experience = data.Experience || 0;
    /**
     * Level
     * @type {number}
     */
    this.level = getLevelForExp(data.Experience);
    /**
     * Level Progress
     * @type {LevelProgress}
     */
    this.levelProgress = getBedwarsLevelProgress(data.Experience);
    /**
      * Formatted Level
      * @type {string}
      */
    this.levelFormatted = getPrestigeIcon(Math.floor(getLevelForExp(data.Experience)));
    /**
     * Prestige
     * @type {BedWarsPrestige}
     */
    this.prestige = data.Experience ? getBedWarsPrestige(getLevelForExp(data.Experience)) : 'Stone';
    /**
     * Played games
     * @type {number}
     */
    this.playedGames = data.games_played_bedwars || 0;
    /**
     * Wins
     * @type {number}
     */
    this.wins = data.wins_bedwars || 0;
    /**
     * Winstreak
     * @type {number}
     */
    this.winstreak = data.winstreak || 0;
    /**
     * Kills
     * @type {number}
     */
    this.kills = data.kills_bedwars || 0;
    /**
     * Final kills
     * @type {number}
     */
    this.finalKills = data.final_kills_bedwars || 0;
    /**
     * Losses
     * @type {number}
     */
    this.losses = data.losses_bedwars || 0;
    /**
     * Deaths
     * @type {number}
     */
    this.deaths = data.deaths_bedwars || 0;
    /**
     * Final deaths
     * @type {number}
     */
    this.finalDeaths = data.final_deaths_bedwars || 0;
    /**
     * Collected items
     * @type {BedWarsCollectedItems}
     */
    this.collectedItemsTotal = {
      iron: data.iron_resources_collected_bedwars || 0,
      gold: data.gold_resources_collected_bedwars || 0,
      diamond: data.diamond_resources_collected_bedwars || 0,
      emerald: data.emerald_resources_collected_bedwars || 0
    };
    /**
     * Beds lost/broken/BL Ratio
     * @type {BedWarsBeds}
     */
    this.beds = {
      lost: data.beds_lost_bedwars || 0,
      broken: data.beds_broken_bedwars || 0,
      BLRatio: divide(data.beds_broken_bedwars, data.beds_lost_bedwars)
    };
    /**
     * Average Kills/Final kills/Beds broken
     * @type {BedWarsAvg}
     */
    this.avg = {
      kills: divide(this.kills, this.playedGames),
      finalKills: divide(this.finalKills, this.playedGames),
      bedsBroken: divide(this.beds.broken, this.playedGames)
    };
    /**
     * Kill Death ratio
     * @type {number}
     */
    this.KDRatio = divide(this.kills, this.deaths);
    /**
     * Final kill death ratio
     * @type {number}
     */
    this.finalKDRatio = divide(this.finalKills, this.finalDeaths);
    /**
     * Win Loss ratio
     * @type {number}
     */
    this.WLRatio = divide(this.wins, this.losses);
    /**
     * BedWars Solo stats
     * @type {BedWarsModeStats}
     */
    this.solo = generateStatsForMode(data, 'eight_one');
    /**
     * BedWars Doubles stats
     * @type {BedWarsModeStats}
     */
    this.doubles = generateStatsForMode(data, 'eight_two');
    /**
     * BedWars 3v3v3v3 stats
     * @type {BedWarsModeStats}
     */
    this.threes = generateStatsForMode(data, 'four_three');
    /**
     * BedWars 4v4v4v4 stats
     * @type {BedWarsModeStats}
     */
    this.fours = generateStatsForMode(data, 'four_four');
    /**
     * BedWars 4v4 stats
     * @type {BedWarsModeStats}
     */
    this['4v4'] = generateStatsForMode(data, 'two_four');
    /**
     * BedWars Dream Mode Stats
     * @type {BedwarsDreamStats}
     */
    this.dream = ['ultimate', 'rush', 'armed', 'lucky', 'voidless'].reduce((ac, mode) => ({
      [mode]: {
        doubles: generateStatsForMode(data, `eight_two_${mode}`),
        fours: generateStatsForMode(data, `four_four_${mode}`)
      }, ...ac
    }), {});
    /**
     * BedWars Castle Stats
     * @type {BedWarsModeStats}
     */
    this.castle = generateStatsForMode(data, 'castle');
  }
}
/**
 * @param {number} level
 * @return {string}
 */
function getBedWarsPrestige (level) {
  // eslint-disable-next-line max-len
  return ['Stone', 'Iron', 'Gold', 'Diamond', 'Emerald', 'Sapphire', 'Ruby', 'Crystal', 'Opal', 'Amethyst', 'Rainbow', 'Iron Prime', 'Gold Prime', 'Diamond Prime', 'Emerald Prime', 'Sapphire Prime', 'Ruby Prime', 'Crystal Prime', 'Opal Prime', 'Amethyst Prime', 'Mirror', 'Light', 'Dawn', 'Dusk', 'Air', 'Wind', 'Nebula', 'Thunder', 'Earth', 'Water', 'Fire'][Math.floor(level / 100)] || 'Rainbow';
}

/**
 * @param {number} xp
 * @return {{currentLevelXp:number,xpToNextLevel:number,percent:number,xpNextLevel:number,percentRemaining:number}}
 */
function getBedwarsLevelProgress(xp) {
  const EASY_XP = [500, 1000, 2000, 3500];
  const NORMAL_XP = 5000;

  let remainingXP = xp;
  let lvl = 0;
  let xpNextLevel = EASY_XP[0];
  while (remainingXP > 0) {
    xpNextLevel = NORMAL_XP;
    if (lvl % 100 < 4) {
      xpNextLevel = EASY_XP[lvl % 100];
    }
    remainingXP -= xpNextLevel;
    lvl++;
  }
  if (remainingXP === 0 && lvl === 0) return { level: 0, currentLevelXp: 0, xpToNextLevel: 500, xpNextLevel: 500, percent: 0, percentRemaining: 100 };
  // const level = lvl + remainingXP / xpNextLevel;
  const currentLevelXp = (remainingXP === 0) ? 0 : xpNextLevel - Math.abs(remainingXP);
  const xpToNextLevel = Math.abs(remainingXP);
  const percent = (currentLevelXp / xpNextLevel * 100).toFixed(2);
  const percentRemaining = Math.round((100 - percent) * 100) / 100;

  return { currentLevelXp, xpToNextLevel, percent, xpNextLevel, percentRemaining };
}

/**
 * @param {number} xp
 * @return {number}
 */
function getLevelForExp(xp) {
  const EASY_XP = [500, 1000, 2000, 3500];
  const NORMAL_XP = 5000;

  let remainingXP = xp;
  let lvl = 0;
  let xpNextLevel = EASY_XP[0];
  while (remainingXP > 0) {
    xpNextLevel = NORMAL_XP;
    if (lvl % 100 < 4) {
      xpNextLevel = EASY_XP[lvl % 100];
    }
    remainingXP -= xpNextLevel;
    lvl++;
  }

  return lvl + remainingXP / xpNextLevel;
}
/**
 * @param {number} level
 * @return {string}
 */
function getPrestigeIcon(level) {
  const prestigeIcons = [
    { level: 0, symbol: '✫' },
    { level: 1100, symbol: '✪' },
    { level: 2100, symbol: '⚝' }
  ];

  for (const element of prestigeIcons.slice().reverse()) {
    if (element.level <= level) return `${level}${element.symbol}`;
  }
  return `${level}`;
}
/**
 * @typedef {string} BedWarsPrestige
 * * `Stone`
 * * `Iron`
 * * `Gold`
 * * `Diamond`
 * * `Emerald`
 * * `Sapphire`
 * * `Ruby`
 * * `Crystal`
 * * `Opal`
 * * `Amethyst`
 * * `Rainbow`
 * * `Iron Prime`
 * * `Gold Prime`
 * * `Diamond Prime`
 * * `Emerald Prime`
 * * `Sapphire Prime`
 * * `Ruby Prime`
 * * `Crystal Prime`
 * * `Opal Prime`
 * * `Amethyst Prime`
 * * `Mirror`
 * * `Light`
 * * `Dawn`
 * * `Dusk`
 * * `Air`
 * * `Wind`
 * * `Nebula`
 * * `Thunder`
 * * `Earth`
 * * `Water`
 * * `Fire`
 */
/**
 * @typedef {object} BedWarsAvg
 * @property {number} kills Average kills
 * @property {number} finalKills Average final kills
 * @property {number} bedsBroken Average beds broken
 */
/**
 * @typedef {object} BedWarsCollectedItems
 * @property {number} iron Iron
 * @property {number} gold Gold
 * @property {number} diamond Diamond
 * @property {number} emerald Emerald
 */
/**
 * @typedef {object} BedWarsBeds
 * @property {number} lost Beds lost
 * @property {number} broken Beds broken
 * @property {number} BLRatio Beds broken/Beds lost ratio
 */
/**
 * @typedef {Object} BedWarsModeStats
 * @property {number} winstreak Winstreak
 * @property {number} playedGames Played games
 * @property {number} kills Kills
 * @property {number} deaths Deaths
 * @property {number} wins Wins
 * @property {number} losses Losses
 * @property {number} finalKills Final kills
 * @property {number} finalDeaths Final deaths
 * @property {BedWarsBeds} beds Beds
 * @property {BedWarsAvg} avg Average Kills/Final kills/Beds broken
 * @property {number} KDRatio Kill Death ratio
 * @property {number} WLRatio Win Loss ratio
 * @property {number} finalKDRatio Final kills/Final deaths ratio
 */
/**
 * @typedef {Object} BedwarsDreamStats
 * @property {BedwarsDreamModeStats} ultimate Ultimate stats
 * @property {BedwarsDreamModeStats} rush Rush stats
 * @property {BedwarsDreamModeStats} armed Armed stats
 * @property {BedwarsDreamModeStats} lucky Lucky Blocks stats (true api naming)
 * @property {BedwarsDreamModeStats} voidless Voidless stats
 */
/**
 * @typedef {Object} BedwarsDreamModeStats
 * @property {BedWarsModeStats} doubles Doubles
 * @property {BedWarsModeStats} fours Fours
 */
module.exports = BedWars;
