const Discord = require("discord.js");
const fs = require('fs');
const path = require('path');
//const config = require("./config.json");
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.login(process.env.TOKEN);
/** 
 * Import other file
 */

 const aliases = require("./Aliases.json")

//const Utils = require('./Utils/test')
const blackList = require("./Tupper_blacklist.json");
const reservation = require("./Reservation.json")

/**
 * Start codding
 */

// new Date(new Date().setDate(new Date().getDate()-2)) == Date d'il y a 2 jours

// Récupère tous les message du channel Réservation
function fetchReservation(){
    client.channels.fetch(aliases.RESERVATION)
    .then(channel => channel.messages.fetch({ limit: 100 })
        .then(messages => {
            let allMessages = {}
            messages.forEach(message => {
                allMessages[message.id] = {
                    "Date": Math.trunc(message.createdTimestamp / 1000),
                    "User": message.author.id
                }
            })
            fs.writeFile("./Reservation.json", JSON.stringify(allMessages, null, 2), err => {
                if (err) throw err;
                console.log('Server successfully add')
            })
        })
    );    
}

function ReservationManager(){
    let rawdata = fs.readFileSync(path.resolve(__dirname, './Reservation.json'));
    let messagesJS = JSON.parse(rawdata);
    var dateRM = new Date();
    dateRM.setDate(dateRM.getDate() - 15);
    var dateWarn = new Date();
    dateWarn.setDate(dateWarn.getDate() - 14);

    for (const [key, value] of Object.entries(messagesJS)) {
        if (value.Date < Math.trunc(dateRM.getTime() / 1000)) {
            client.channels.fetch(aliases.RESERVATION)
                .then(channel => channel.messages.fetch(key).then(msg => msg.delete()))
                .catch(console.error);
            delete messagesJS[key]
            fs.writeFile("./Reservation.json", JSON.stringify(messagesJS, null, 2), err => {
                if (err) throw err;
                console.log('Data successfully remove')
            })
        } else if (value.Date < Math.trunc(dateWarn.getTime() / 1000)) {
            client.channels.fetch(aliases.RESERVATION)
                .then(channel => channel.messages.fetch(key).then(msg => msg.reply(aliases.MSG_WARN_RESERVATION)))
                .catch(console.error);
        }
    }
}
let timer = setInterval(function() {
    ReservationManager()
  }, 1000 * 60 * 60 * 24); // time is in milliseconds. 1000 ms * 60 sec * 60 min * 24 hour
  
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
    fetchReservation()
    ReservationManager()
    timer
})

client.on("message", msg => {
    // In Flood RP Channel
    if (msg.channelId == aliases.FLOOD_BOT)
      // Remove Blacklisted TupperBot message
      if (msg.author.username in blackList)
          msg.delete()
    // In Reservation Channel && not CoventryBot
    if (msg.channelId == aliases.RESERVATION && msg.author.id != aliases.LE_BOT) {
        // Add Data to Reservation.json
        let rawdata = fs.readFileSync(path.resolve(__dirname, './Reservation.json'));
        let reserv = JSON.parse(rawdata);
        reserv[msg.id] = {
            "Date": Math.trunc(msg.createdTimestamp / 1000),
            "User": msg.author.id
        }

        fs.writeFile("./Reservation.json", JSON.stringify(reserv, null, 2), err => {
            if (err) throw err;
            console.log('Server successfully add')
        })
    }
})
