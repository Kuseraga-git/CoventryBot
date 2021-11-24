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

async function asyncTest(){
  const channel = await client.channels.fetch("913179876780032011");
  fs.readFile('msgs.json', (err, data) => {
    if (err) { throw err; }
    const _msgs = JSON.stringify(JSON.parse(data), null, 2);
    channel.send('```json\n' + _msgs + '\n```');
    console.log(_msgs)
  });
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
    if (msg.channelId == "913179876780032011" && msg.author.id != "911003008744161340") {
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
      
      asyncTest()
    }
})
