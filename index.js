const Discord = require("discord.js");
const config = require("./config.json");
const { Client, Intents } = require('discord.js');
//const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
//client.login(config.TOKEN);
client.login(process.env.TOKEN);
/** 
 * Import other file
 */

const Utils = require('./Utils/test') 

// That was a test
const sadWords = ["sad", "depressed", "unhappy", "angry", "miserable"]
const encouragements = [
    "Cheer up!",
    "Hang in there.",
    "You are a great person / bot!"
]
  


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
    if (msg.content === "$inspire") {
        getQuote().then(quote => msg.channel.send(quote))
    }

    if (msg.content === "ping") {
        Utils.test(msg)
        }

    if (sadWords.some(word => msg.content.includes(word))) {
        const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)]
        msg.reply(encouragement)
    }
})
