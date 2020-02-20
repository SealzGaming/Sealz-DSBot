class ElasticVoice {

    constructor(bot, guild) {
        this.bot = bot;
        this.guild = guild;
    }

    categoryChannels(categoryName) {
        return this.guild.channels.filter(channel => channel.type == 'category');
    }

    categoryChannelByName(categoryName) {
        return this.categoryChannels(categoryName).find(channel => channel.name == categoryName);
    }

    channelsByCategory(categoryName) {
        return this.categoryChannelByName(categoryName).children;
    }

    voiceChannelsByCategory(categoryName) {
        return this.channelsByCategory(categoryName).filter(channel => channel.type == 'voice');
    }

    voiceChannelByName(categoryName, channelName) {
        return this.voiceChannelsByCategory(categoryName).find(channel => channel.name == channelName);
    }

    createVoiceChannel(channelName, categoryName) {

        let categoryChannel = this.categoryChannelByName(categoryName);
        let channelData = { type: 'voice', position: 1, parent: categoryChannel };

        let channelInCategory = this.voiceChannelByName(categoryName, channelName)
        // If channel with same name exists return existing, avoid duplicated channels with same name
        if (channelInCategory != null)
            return channelInCategory;

        return this.guild.createChannel(channelName, channelData);
    }

    createElasticVoiceChannel(channelName, categoryName) {
        Promise.resolve(this.createVoiceChannel(channelName, categoryName)).then(channel => {
            this.joinVoiceChannelEvent(channel, (user) => {
                Promise.resolve(this.createVoiceChannel(user.displayName, categoryName)).then(channel => {
                    user.setVoiceChannel(channel)
                    this.leaveVoiceChannelEvent(channel, () => {
                        if (channel.members.size === 0) {
                            channel.delete();
                        }
                    });
                });
            });
        });
    }

    joinVoiceChannelEvent(channel, doThis) {
        return this.bot.on('voiceStateUpdate', (userOld, userNew) => {
            let userCurrentChannel = userNew.voiceChannel;
            if (userCurrentChannel === channel) {
                doThis(userNew);
            }
        });
    }

    leaveVoiceChannelEvent(channel, doThis) {
        return this.bot.on('voiceStateUpdate', (userOld, userNew) => {
            let userOldChannel = userOld.voiceChannel;
            if (userOldChannel === channel) {
                doThis();
            }
        });
    }
}


module.exports = ElasticVoice;