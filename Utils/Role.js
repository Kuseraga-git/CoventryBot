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
/*
const roleList = [
    '<:Animorphe:958383605736960000>',
    '<:Dragon:958383697671913603>',
    '<:Elfe:958383733004722207>',
    '<:Fee:958383756593471558>',
    '<:Kistune:958383810813259806>',
    '<:Legende:958383841289076846>',
    '<:Lycan:958383954384289802>',
    '<:Necromantien:958383998227341312>',
    '<:Sirene:958384036378738738>',
    '<:Sorcier:958384056532336720>',
    '<:Valarjar:958384093442236478>',
    '<:Vampire:958384120952651837>',
    '<:Humain:958383780186427392>'
]*/

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