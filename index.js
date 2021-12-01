const Discord = require("discord.js");
const fs = require('fs');
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

 function test(){
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
                .then(channel => channel.messages.fetch(key).then(msg => msg.reply("Vos réservations arrivent à terme, je vous invite à les renouveler :wink:\n <@&915540936182886450> ")))
                .catch(console.error);
        }
    }
}
let timer = setInterval(function() {
  	test()
}, 1000 * 60 * 60 * 24); // time is in milliseconds. 1000 ms * 60 sec * 15 min

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`)
	test()
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
