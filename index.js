const Discord = require("discord.js");
const { MessageEmbed } = require('discord.js');
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
    Reservation.ReservationManager(client)
  }, 1000 * 60 * 60 * 24); // time is in milliseconds. 1000 ms * 60 sec * 60 min * 24 hour
  
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
    Reservation.fetchReservation(client)
    Reservation.ReservationManager(client)
    timer
})

client.on("message", msg => {
    /**
     *  Flag Manager
     */
    // Use cmd to create Role + add it
    if (Utils.hasPrefix(msg) && Utils.hasRights(msg.member._roles) && msg.content.split(',').length == 2){
        
        const member = msg.mentions.members.first() // Get mentionned user
        const roleName = msg.content.match(/,(.*)$/g)[0].substring(1).trim()

        const channel = client.channels.cache.get(msg.channelId)
        let embedMessage = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Création du rôle')
            .setDescription(`Quelle est la race de ${roleName}`)
            .setTimestamp();

        channel.send({ embeds: [embedMessage] }).then(message => {
            for (const role of Role.roleList)
                message.react(role)
            const filter = (reaction, user) => {
                return true/*Role.roleList.includes('<:' + reaction.emoji.name + ':' + reaction.emoji.id + '>') && Utils.hasRights(reaction.message.guild.members.cache.get(user.id).roles.member._roles)*/
            }
            message.awaitReactions({ filter, max: 1, time: 120000, errors: ['time'] })
                .then(collected => {
                    console.log('je suis rentré ========================')
                    const reaction = collected.first()
                    const species = reaction.emoji.name
                    message.reactions.removeAll()
	                    .catch(error => console.error('Failed to clear reactions:', error));
                    embedMessage = new MessageEmbed()
                        .setDescription(`Un nouveau ${species} ! \nCe serait le personnage n°`)
                    message.edit({embeds: [embedMessage]})
                    for (const number of Role.characterNumber)
                        message.react(number)
                    const filter = (reaction, user) => {
                        return ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣'].includes(reaction.emoji.name) && Utils.hasRights(reaction.message.guild.members.cache.get(user.id).roles.member._roles);
                    }
                    message.awaitReactions({ filter, max: 1, time: 120000, errors: ['time'] })
                        .then(collected => {
                            const reaction = collected.first()
                            const number = reaction.emoji.name
                            message.reactions.removeAll()
	                            .catch(error => console.error('Failed to clear reactions:', error));
                            embedMessage = new MessageEmbed()
                                .setDescription(`Un nouveau ${species} ! \nPersonnage n°${number}\nClasse sociale du personnage ?\n💵 = Riche\n🧽 = Moyen\n🥻 = Pauvre`)
                            message.edit({embeds: [embedMessage]})
                            for (const socialClass of Role.socialClasses)
                                message.react(socialClass)
                            const filter = (reaction, user) => {
                                return ['💵', '🧽', '🥻'].includes(reaction.emoji.name) && Utils.hasRights(reaction.message.guild.members.cache.get(user.id).roles.member._roles);
                            }
                            message.awaitReactions({ filter, max: 1, time: 120000, errors: ['time'] })
                                .then(collected => {
                                    const reaction = collected.first()
                                    const socialClass = reaction.emoji.name
                                    message.reactions.removeAll()
                                        .catch(error => console.error('Failed to clear reactions:', error));
                                    /** 
                                     * CREATION DU ROLE
                                    */
                                    if (msg.guild.roles.cache.find(role => role.name === roleName) == undefined)
                                    {
                                        let rInfo = msg.guild.roles.cache.find(r => r.id === roleManager.Nb_Player[number])
                                        // member
                                        msg.guild.roles.create({
                                            name: roleName,
                                            color: roleManager.Species[species][0],
                                            position: rInfo.rawPosition - 1,
                                            mentionable : true,
                                            reason: 'we needed a role for Super Cool People',
                                        })
                                        .then(role => {
                                            member.roles.add(role.id);
                                            Role.attributeRoles(member, msg, number, socialClass, species)
                                            embedMessage = new MessageEmbed()
                                                .setTitle('Role crée !')
                                                .setDescription("J'ai crée et attribué les rôles du joueur o/")
                                                .setTimestamp();
                                    
                                            message.edit({embeds: [embedMessage]}).then(console.log('Role Create and set with success'))
                                        })
                                        .catch(console.error);
                                    }
                                })
                                .catch(collected => {
                                    //message.reply('Not so classy man')
                                })
                        })
                        .catch(collected => {
                            message.reply('Number Fooo.')
                        })
                })
                .catch(collected => {
                    message.reply('You reacted with neither a thumbs up, nor a thumbs down.')
                })
        }
    )}

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
