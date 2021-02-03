const handler = require('../../handlers/music.js');

module.exports = {
    name: "disconnect",
		aliases: ["dc","leave"],
    category: "music",
		shortdescription: "Disconnects bot.",
    description: "Gets the bot to disconnect from it's curret voice channel",
    usage: "[command | alias]",
    run: async (client, message, args) => {
			handler.disconnect(message);
		}
}