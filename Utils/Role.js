const fs = require('fs');
const path = require('path');

const Utils = require('./Utils')
const Reservation = require('./Reservation')
const blackList = require("./../Tupper_blacklist.json");
const roleManager = require("./../Role_Manager.json")
const reservation = require("./../Reservation.json")
const aliases = require("./../Aliases.json")

function attributeRoles(member, msg, number, species){
    member.roles.add(msg.guild.roles.cache.find(r => r.id === roleManager.Nb_Player[number]).id);
    if (number == "1")
        member.roles.add(msg.guild.roles.cache.find(r => r.id === roleManager.Species[species][Object.keys(roleManager.Nb_Player).indexOf(number) +1]).id);
}

const speciesOptions = [
    {
        label: 'Animorphe',
        value: 'Animorphe',
    },
    {
        label: 'Chapardeur',
        value: 'Chapardeur',
    },
    {
        label: 'Dragon',
        value: 'Dragon',
    },
    {
        label: 'Elfe',
        value: 'Elfe',
    },
    {
        label: 'Fée',
        value: 'Fée',
    },
    {
        label: 'Humain',
        value: 'Humain',
    },
    {
        label: 'Kistune',
        value: 'Kistune',
    },
    {
        label: 'Légende',
        value: 'Légende',
    },
    {
        label: 'Lycan',
        value: 'Lycan',
    },
    {
        label: 'Nécromantien',
        value: 'Nécromantien',
    },
    {
        label: 'Sirène',
        value: 'Sirène',
    },
    {
        label: 'Sorcier',
        value: 'Sorcier',
    },
    {
        label: 'Valarjar',
        value: 'Valarjar',
    },
    {
        label: 'Vampire',
        value: 'Vampire',
    }
]

const characterOptions = [
    {
        label: 'Premier perso',
        value: '1',
    },
    {
        label: 'Second perso',
        value: '2',
    },
    {
        label: 'Troisième perso',
        value: '3'
    },
    {
        label: 'Quatrième perso',
        value: '4',
    },
    {
        label: 'Cinquième perso',
        value: '5',
    },
    {
        label: 'Sixième perso',
        value: '6'
    },
    {
        label: 'Pnj',
        value: 'Pnj'
    }
]

exports.characterOptions = characterOptions
exports.speciesOptions = speciesOptions
exports.attributeRoles = attributeRoles