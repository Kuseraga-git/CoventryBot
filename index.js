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

const Utils = require('./Utils/Utils')
const Role = require('./Utils/Role')
const Reservation = require('./Utils/Reservation')
const blackList = require("./Tupper_blacklist.json");
const roleManager = require("./Role_Manager.json")
const reservation = require("./Reservation.json")

/**
 * Start codding
 */

let timer = setInterval(function() {
    Reservation.ReservationManager()
  }, 1000 * 60 * 60 * 24); // time is in milliseconds. 1000 ms * 60 sec * 60 min * 24 hour
  
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
    Reservation.fetchReservation()
    // ReservationManager()
    timer
})

client.on("message", msg => {
    /**
     *  Flag Manager
     */
    // Use cmd to create Role + add it
    if (Utils.hasPrefix(msg) && Utils.hasRights(msg.member._roles)){
        const paramArr = msg.content.split(',').map(str => str.trim())
        let rInfo = msg.guild.roles.cache.find(r => r.id === roleManager.Nb_Player[paramArr[1].trim()])
        let member = msg.mentions.members.first()
        msg.guild.roles.create({
            name: paramArr[0].replace('!cov ', ''),
            color: roleManager.Species[paramArr[2].trim()][0],
            position: rInfo.rawPosition - 1,
            mentionable : true,
            reason: 'we needed a role for Super Cool People',
        })
        .then(role => {
            member.roles.add(role.id);
        })
        .catch(console.error);
        Role.attributeRoles(member, msg, paramArr)
    }

    // In Flood RP Channel
    else if (msg.channelId == aliases.FLOOD_BOT)
      // Remove Blacklisted TupperBot message
      if (msg.author.username in blackList)
          msg.delete()
    // In Reservation Channel && not CoventryBot
    else if (msg.channelId == aliases.RESERVATION && msg.author.id != aliases.LE_BOT && /Réservation de/g.test(msg.content)) {
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
