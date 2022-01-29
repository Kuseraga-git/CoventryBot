const Role = require('./Role')
const Reservation = require('./Reservation')
const blackList = require("./../Tupper_blacklist.json");
const roleManager = require("./../Role_Manager.json")
const reservation = require("./../Reservation.json")
const aliases = require("./../Aliases.json")

let prefixList = ['!cov ']

function hasPrefix(msg) {
    for(const pre of prefixList)
        if(msg.content.startsWith(pre))
            return true;
    return false;
}

function hasRights(roles){
    for (const role of aliases.ID_ADMIN_ROLE) {
        if (roles.includes(role))
            return true
    }
    return false
}

exports.hasPrefix = hasPrefix
exports.hasRights = hasRights