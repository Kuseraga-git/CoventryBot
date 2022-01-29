function attributeRoles(member, msg, paramArr){
    member.roles.add(msg.guild.roles.cache.find(r => r.id === roleManager.Nb_Player[paramArr[1].trim()]).id);
    member.roles.add(msg.guild.roles.cache.find(r => r.id === roleManager.Classe[paramArr[1].trim()][paramArr[4].trim()]).id);
    member.roles.add(msg.guild.roles.cache.find(r => r.id === roleManager.Species[paramArr[2].trim()][parseInt(paramArr[1].trim())]).id);
}