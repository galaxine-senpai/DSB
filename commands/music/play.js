const handler = require('../../handlers/music.js');

module.exports = {
    name: "play",
    category: "music",
		shortdescription: "Plays music.",
    description: "Plays given song off youtube",
    usage: "[command | alias]",
    run: async (client, message, args) => {
			handler.play(message, args, client);
		}
}