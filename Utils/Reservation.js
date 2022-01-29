const Utils = require('./Utils')
const Role = require('./Role')
const blackList = require("./../Tupper_blacklist.json");
const roleManager = require("./../Role_Manager.json")
const reservation = require("./../Reservation.json")
const aliases = require("./../Aliases.json")

// Récupère tous les message du channel Réservation
function fetchReservation(client){
    client.channels.fetch(aliases.RESERVATION)
    .then(channel => channel.messages.fetch({ limit: 100 })
        .then(messages => {
            let allMessages = {}
            messages.forEach(message => {
				if (message.id != "883674745969717298" && message.id != "883675840599166986" && message.id != "883675877098016808" && message.id != "883675877098016808" && /Réservation de/g.test(message.content)) {
					allMessages[message.id] = {
						"Date": Math.trunc(message.createdTimestamp / 1000),
						"User": message.author.id
					}
				}
            })
			console.log(allMessages)
            fs.writeFile("./Reservation.json", JSON.stringify(allMessages, null, 2), err => {
                if (err) throw err;
                console.log('Server successfully add')
            })
        })
    );    
}

// new Date(new Date().setDate(new Date().getDate()-2)) == Date d'il y a 2 jours

function ReservationManager(client){
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
                .then(channel => channel.messages.fetch(key).then(msg => msg.reply(aliases.MSG_WARN_RESERVATION)))
                .catch(console.error);
        }
    }
}

exports.fetchReservation = fetchReservation
exports.ReservationManager = ReservationManager