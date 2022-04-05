const Discord = require("discord.js");
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const fs = require('fs');
const path = require('path');
//const config = require("./config.json");
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGES] });
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
    Reservation.ReservationManager(client)
  }, 1000 * 60 * 60 * 24); // time is in milliseconds. 1000 ms * 60 sec * 60 min * 24 hour
  
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
    Reservation.fetchReservation(client)
    Reservation.ReservationManager(client)
    timer
})

client.on('interactionCreate', async interaction => {
	if (interaction.isSelectMenu() && Utils.hasRights(interaction.member._roles)) {
        const member = interaction.message.mentions.members.first()
        switch (interaction.customId) {
            case 'Species':
                // console.log(interaction.member._roles)
                let numberSaveResult = Role.characterOptions
                //console.log(interaction)
                for (const element of interaction.values){
                    numberSaveResult.push({
                        label: element,
                        value: element,
                        default: true
                    })
                }
                const numberRow = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId('Number')
                            .setMinValues(3)
                            .setMaxValues(3)
                            .addOptions(numberSaveResult),
                    );
                await interaction.channel.send({content: `<@${member.user.id}>`, components: [numberRow] })
                break;
            case 'Number':
                let socialSaveResult = Role.socialOptions
                //console.log(interaction.values)
                for (const element of interaction.values){
                    socialSaveResult.push({
                        label: element,
                        value: element,
                        default: true
                    })
                }
                const socialRow = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId('Social')
                            .setMinValues(4)
                            .setMaxValues(4)
                            .addOptions(socialSaveResult),
                    );
                await interaction.channel.send({content: `<@${member.user.id}>`, components: [socialRow] })
                break;
                
            case 'Social':
                const characterName = interaction.values[0]
                const species = interaction.values[1]
                const number = interaction.values[2]
                const social = interaction.values[3]
                const channel = client.channels.cache.get(interaction.channelId)
        
                // msg.guild.roles.cache.find(r => r.id === roleManager.Nb_Player[number])
                if (interaction.guild.roles.cache.find(role => role.name === characterName) == undefined)
                {
                    let rInfo = interaction.guild.roles.cache.find(r => r.id === roleManager.Nb_Player[number])
                    // member
                    interaction.guild.roles.create({
                        name: characterName,
                        color: roleManager.Species[species][0],
                        position: rInfo.rawPosition - 1,
                        mentionable : true,
                        reason: 'we needed a role for Super Cool People',
                    })
                    .then(role => {
                        member.roles.add(role.id);
                        Role.attributeRoles(member, interaction, number, social, species)
                        const embedMessage = new MessageEmbed()
                            .setTitle('Role crée !')
                            .setColor('#0099ff')
                            .setDescription("J'ai crée et attribué les rôles du joueur o/")
                            .setTimestamp();
                        channel.send({embeds: [embedMessage]}).then(console.log('Role Create and set with success'))
                    })
                    .catch(console.error);
                }
                break;
        }
    }
});

client.on("messageCreate", async msg => {
    /**
     *  Flag Manager
     */
    // Use cmd to create Role + add it
    if (Utils.hasPrefix(msg) && Utils.hasRights(msg.member._roles) && msg.content.split(',').length == 2){
        
        const member = msg.mentions.members.first() // Get mentionned user
        const roleName = msg.content.match(/,(.*)$/g)[0].substring(1).trim() // Get Character Name
        const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('Species')
					.setPlaceholder('Nothing selected')
                    .setMinValues(2)
                    .setMaxValues(2)
					.addOptions(Role.speciesOptions)
                    .addOptions({
                        label: `${roleName}`,
                        value: `${roleName}`,
                        default: true
                    }),
			);
        await msg.channel.send({content: `<@${member.user.id}>`, components: [row] })
    }

    // In Flood RP Channel
    if (msg.channelId == aliases.FLOOD_BOT)
      // Remove Blacklisted TupperBot message
      if (msg.author.username in blackList)
          msg.delete()
    // In Reservation Channel && not CoventryBot
    if (msg.channelId == aliases.RESERVATION && msg.author.id != aliases.LE_BOT && /Réservation de/g.test(msg.content)) {
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
