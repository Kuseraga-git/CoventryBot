const Discord = require("discord.js");
const fs = require('fs');
//const config = require("./config.json");
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.login(process.env.TOKEN);
/** 
 * Import other file
 */

//const Utils = require('./Utils/test')
const blackList = require("./Tupper_blacklist.json");
const reservation = require("./Reservation.json")

/**
 * Start codding
 */
  
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
    if (msg.channelId == "884843344117788762") {
      const user = {
        "id": msg.channelId,
        "Date": msg.createdAt, //.createdTimestamp
        "User": msg.author.id
      };
    
    // convert JSON object to string
    const data = JSON.stringify(user);
    
    // write JSON string to a file
    fs.writeFile('Reservation.json', data, (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.");
    });
    }
})
