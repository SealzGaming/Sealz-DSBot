class Voice {

    constructor(bot, guild) {
        this.bot = bot;
        this.guild = guild;
    }

    categoryChannel(categoryName) {
        return this.guild.channels.find(channel => channel.name == categoryName);
    }

    channelsByCategory(categoryName) {
        return this.categoryChannel(categoryName).children;
    }

    voiceChannelsByCategory(categoryName) {
        return this.channelsByCategory(categoryName).filter(channel => channel.type == 'voice');
    }

    voiceChannelByName(categoryName, channelName) {
        return this.voiceChannelsByCategory(categoryName).find(channel => channel.name == channelName);
    }

    async createVoiceChannel(channelName, categoryName) {

        var categoryChannel = this.categoryChannel(categoryName);
        var channelData = { type: 'voice', position: 1, parent: categoryChannel };

        var channelInCategory = this.voiceChannelByName(categoryName, channelName)
        // If channel exists, happens when bot restarts can lead to duplicate channels
        if (channelInCategory != null)
            return channelInCategory;
        
        return await this.guild.createChannel(channelName, channelData);
    }

    async createElasticVoiceChannel(channelName, categoryName) {
        var creatorChannel = await this.createVoiceChannel(channelName, categoryName);

        this.bot.on('voiceStateUpdate', async (oldUser, newUser) => {
            var newUserChannel = newUser.voiceChannel;

            if (newUserChannel === creatorChannel) {
                var tmpChannel = await this.createVoiceChannel(newUser.displayName, categoryName);
                await newUser.setVoiceChannel(tmpChannel);

                this.bot.on('voiceStateUpdate', async (oldUser, newUser) => {
                    var oldUserChannel = oldUser.voiceChannel;
                    if (oldUserChannel === tmpChannel && tmpChannel.members.size === 0) {
                        tmpChannel.delete();
                    }
                });
            }
        });
    }
}

module.exports = Voice;