const Utils = require('./Utils')
const Reservation = require('./Reservation')
const blackList = require("./../Tupper_blacklist.json");
const roleManager = require("./../Role_Manager.json")
const reservation = require("./../Reservation.json")
const aliases = require("./../Aliases.json")

function attributeRoles(member, msg, paramArr){
    member.roles.add(msg.guild.roles.cache.find(r => r.id === roleManager.Nb_Player[paramArr[1].trim()]).id);
    member.roles.add(msg.guild.roles.cache.find(r => r.id === roleManager.Classe[paramArr[1].trim()][paramArr[4].trim()]).id);
    member.roles.add(msg.guild.roles.cache.find(r => r.id === roleManager.Species[paramArr[2].trim()][parseInt(paramArr[1].trim())]).id);
}

exports.attributeRoles = attributeRoles