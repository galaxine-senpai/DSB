const handler = require('../../handlers/music.js');

module.exports = {
    name: "summon",
    category: "music",
		shortdescription: "Summons bot.",
    description: "Gets the bot to join your curent voicechannel",
    usage: "[command | alias]",
    run: async (client, message, args) => {
			handler.summon(message);
		}
}