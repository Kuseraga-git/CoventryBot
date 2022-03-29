const fs = require('fs');
const path = require('path');

const Utils = require('./Utils')
const Reservation = require('./Reservation')
const blackList = require("./../Tupper_blacklist.json");
const roleManager = require("./../Role_Manager.json")
const reservation = require("./../Reservation.json")
const aliases = require("./../Aliases.json")

function attributeRoles(member, msg, number, socialClass, species){
    member.roles.add(msg.guild.roles.cache.find(r => r.id === roleManager.Nb_Player[number]).id);
    member.roles.add(msg.guild.roles.cache.find(r => r.id === roleManager.Classe[number][socialClass]).id);
    member.roles.add(msg.guild.roles.cache.find(r => r.id === roleManager.Species[species][Object.keys(roleManager.Nb_Player).indexOf(number) +1]).id);
}

const roleList = [
    '<:Animorphe:958383605736960000>',
    '<:Dragon:958383697671913603>',
    '<:Elfe:958383733004722207>'
]

const characterNumber = [
    '1️⃣',
    '2️⃣',
    '3️⃣',
    '4️⃣',
    '5️⃣',
    '6️⃣'
]

const socialClasses = [
    '💵',
    '🧽',
    '🥻'
]

exports.roleList = roleList
exports.characterNumber = characterNumber
exports.socialClasses = socialClasses
exports.attributeRoles = attributeRoles