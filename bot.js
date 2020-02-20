const config = require('./config.json');
const Discord = require('discord.js');
const ElasticVoice = require('./commands/elasticVoice.js');
const DB = require('./helpers/database/db.js');

const bot = new Discord.Client();

// Bot ready to work
bot.once('ready', () => {
    console.log("I'm ready");
    console.log(`Logged in as ${bot.user.tag}!`);

    // TODO: Load information from database in case of bot restart
    var db = new DB();
    db.createDb();
});

// Bot joined a new server
bot.on('guildCreate', guild => {
    guild.members.get(bot.user.id).setNickname(config.botName)
});

// Bot left a server
bot.on('guildDelete', guild => {
    // TODO: Clean server info from database? What if deleted by mistake?
});

// New message sent, let's parse it.
bot.on('message', message => {
    let name = 'Test';
    let test = new ElasticVoice(bot, message.guild);
    test.createElasticVoiceChannel(name, message.content);
});

bot.login(config.token);

//var guild = bot.guilds.get("the guild id");