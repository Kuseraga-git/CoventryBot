const Discord = require("discord.js");
//const config = require("./config.json");
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.login(process.env.TOKEN);
/** 
 * Import other file
 */

//const Utils = require('./Utils/test')
const blackList = require("./../Tupper_blacklist.json");

/**
 * Start codding
 */

function getQuote() {
    return fetch("https://zenquotes.io/api/random")
      .then(res => {
        return res.json()
        })
      .then(data => {
        return data[0]["q"] + " -" + data[0]["a"]
      })
  }
  
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on("message", msg => {
    // Dans channel Chat RP
    if (msg.channelId == "763440831532761102") {
        // Remove Blacklisted TupperBot message
        if (msg.author.username in blackList) {
            msg.delete()
        }
    }
})
