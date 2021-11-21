const blackList = require("./../Tupper_blacklist.json");

function test(msg){
    if (msg.channelId == "884843344117788762") {
        if (msg.author.username in blackList) {
            msg.channel.send(msg.author.username)
        }
    }
}

exports.test = test;