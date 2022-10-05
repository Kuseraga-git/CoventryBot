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
        value: 'animorphe',
    },
    {
        label: 'Chapardeur',
        value: 'chapardeur',
    },
    {
        label: 'Dragon',
        value: 'dragon',
    },
    {
        label: 'Elfe',
        value: 'elfe',
    },
    {
        label: 'Fée',
        value: 'fee',
    },
    {
        label: 'Humain',
        value: 'humain',
    },
    {
        label: 'Kistune',
        value: 'kistune',
    },
    {
        label: 'Légende',
        value: 'legende',
    },
    {
        label: 'Lycan',
        value: 'lycan',
    },
    {
        label: 'Nécromantien',
        value: 'necromantien',
    },
    {
        label: 'Sirène',
        value: 'sirene',
    },
    {
        label: 'Sorcier',
        value: 'sorcier',
    },
    {
        label: 'Valarjar',
        value: 'valarjar',
    },
    {
        label: 'Vampire',
        value: 'vampire',
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