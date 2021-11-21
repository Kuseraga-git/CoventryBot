function test(msg){
    if (msg.channelId == "884843344117788762") {
        msg.channel.send(msg.author.username)
    }
}

exports.test = test;