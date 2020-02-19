const Voice = require('./voice.js');
const Discord = require('discord.js');
const bot = new Discord.Client();
const token = 'Njc5NTk0NjMyMzg4NDExNDMy.Xk2J6Q.r5wGZ7ua7kXvIvX2-MQXJYuvlO4';

bot.on('ready', () => {
    console.log("I'm ready");
    console.log(`Logged in as ${bot.user.tag}!`);
    
    var guildid = '370437171410108416';
    var category = 'LoL';
    var name = 'Test';

    var guild = bot.guilds.get(guildid);
    guild.members.get(bot.user.id).setNickname('=SEALZ=Bot')

    var test = new Voice(bot, guild);
    test.createElasticVoiceChannel(name, category);

});

bot.login(token);

//var guild = bot.guilds.get("the guild id");