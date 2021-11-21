const blackList = require("./../Tupper_blacklist.json");

function test(msg){
    if (msg.channelId == "884843344117788762") {
        if (msg.author.username in blackList) {
            msg.delete()
        }
    }
}

exports.test = test;