const Discord = require('discord.js')
const minesweeper = require('minesweeper');
var BoardStateEnum = minesweeper.BoardStateEnum;
var CellStateEnum = minesweeper.CellStateEnum;
var CellFlagEnum = minesweeper.CellFlagEnum;

async function gamems(gamemsg, board, size, state, message) {
	gamemsg = await message.channel.send(`\*\*\<\@${message.author.id}\>\'s Minesweeper game\*\* \n` + render(board, size, state));
}

var render = function(board, size, state) {
	var grid = board.grid();
	var states = "⬛ 🟨 🟥 🟩"
	var xcoords = "🇦 🇧 🇨 🇩 🇪 🇫 🇬 🇭 🇮";
	var ycoords = "🟦 1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ 6️⃣ 7️⃣ 8️⃣ 9️⃣";
	var emotes = `${states.split(" ").slice(state,state+1)} `
	emotes += xcoords.split(" ").slice(0,size).join(" ");
	if (state === 2){
			for (j = 0; j < size; j++) {
					var line = grid[j];
					for (i=0; i<line.length; i++) {
							cell = line[i];
							if (cell.x === 0) {
								emotes = emotes + `\n` + ycoords.split(" ").slice(cell.y+1 ,cell.y+2) + " " 
							}

							if (cell.state === CellStateEnum.CLOSED) {
								if (cell.isMine) {
									emotes += '💣 ';
								} else {
									if (cell.flag === CellFlagEnum.NONE) {
										emotes += '⬛ ';
									} else if (cell.flag === CellFlagEnum.EXCLAMATION) {
										emotes += '🚩 ';
										board.cycleCellFlag(cell.x,cell.y)
									} else if (cell.flag === CellFlagEnum.QUESTION) {
										emotes += '🚩 ';
									}
								}
							} else {
									if (cell.state === CellStateEnum.OPEN) {
									if (cell.isMine) {
										emotes += '💥 ';
									} else {
										emotes += (`${ycoords.split(" ").slice(cell.numAdjacentMines,cell.numAdjacentMines+1)} `);
									}
								}
							}
					}
			}
	} else {
			for (j = 0; j < size; j++) {
				var line = grid[j];
				for (i=0; i<line.length; i++) {
								cell = line[i];
								if (cell.x === 0) {
									emotes = emotes + `\n` + ycoords.split(" ").slice(cell.y+1 ,cell.y+2) + " " 
								}

								if (cell.state === CellStateEnum.CLOSED) {
									if (cell.flag === CellFlagEnum.NONE) {
										emotes += '⬛ ';
									} else if (cell.flag === CellFlagEnum.EXCLAMATION) {
										emotes += '🚩 ';
									} else if (cell.flag === CellFlagEnum.QUESTION) {
										emotes += '🚩 ';
									}
								} else if (cell.state === CellStateEnum.OPEN) {
									if (cell.isMine) {
										emotes += '💥 ';
									} else {
										emotes += (`${ycoords.split(" ").slice(cell.numAdjacentMines,cell.numAdjacentMines+1)} `);
									}
								}
				}
			}
					
	}
		return emotes;
}

//checking for win/lose condition
var check = function(state) {
	if (state === BoardStateEnum.PRISTINE) return 0;
	if (state === BoardStateEnum.IN_PROGRESS) return 1;
	if (state === BoardStateEnum.LOST) {
		/*collector.stop();
		message.channel.send(`\*\*\<\@${message.author.id}\>\'s Minesweeper game\*\*\n${render}\n\nOh no! You dug a bomb.`*/
		return 2;
	}
	if (state === BoardStateEnum.WON) {
		return 3;
	}
}

/*var responsehandler = function(message, size, board, command) {
        const command.channel.createMessageCollector(m => m.author = command.author, {
          time: 60000
        })
        .then((collected) => {
					if (response.author === message.author) { return;}
						if (response.split("").length < 2) {
							
							return;
						} else {
						var split = response.split("");
						var x,y;
						switch (split[0]) {
							case "a": 
								x=0;
								break;
							case "b": 
								x=1;
								break;
							case "c": 
								x=2;
								break;
							case "d": 
								x=3;
								break;
							case "e": 
								x=4;
								if (4<size) {break} else {return;}
							case "f": 
								x=5;
								if (5<size) {break} else {return;}
							case "g": 
								x=6;
								if (6<size) {break} else {return;}
							case "h": 
								x=7;
								if (7<size) {break} else {return;}
							case "i": 
								x=8;
								if (8<size) {break} else {return;}
						}
						y=Number(split[1])-1;
						if(!split[2]) {
							board.openCell(x,y);
							grid = board.grid(board.state())
						} else {
							if(split[2] = "f") {
								board.cycleCellFlag(x,y)
								grid = board.grid(board.state())
							} else {
								board.openCell(x,y);
								grid = board.grid(board.state())
							}
						}
            await message.channel.send(`\*\*\<\@${message.author.id}\>\'s Minesweeper game\*\* \n` + render(board,size))
						}	
          })
          .catch(function(){
            message.channel.send(`Response timeout\: You didn\'t answer in 1 minute`);
						message.delete();
          });
}*/

module.exports = {
  name: "minesweeper",
  category: "fun",
	aliases: ["ms","mines"],
  description: "A fun game of minesweeper",
  usage: "{PREFIX}minesweeper [bomb amount] [size]",
  run: async (client, message, args) => {
		const prefix = require('discord-prefix');
		const config = require("../../settings/config.json");
				//Loads prefix from config.json
        var defaultPrefix = config.prefix;
        //get the prefix for the discord server
        var guildPrefix = prefix.getPrefix(message.guild.id);
        //set prefix to the default prefix if there isn't one
        if (!guildPrefix) guildPrefix = defaultPrefix;
		var state;
		if(!Number(args[0])) {
			var size = 7;
			var bombs = 15;
			var mineArray = minesweeper.generateMineArray({
				rows: size,
				cols: size,
				mines: bombs
			});
			var board = new minesweeper.Board(mineArray);
			var grid = board.grid();
			var gamemsg = await message.channel.send(`\*\*\<\@${message.author.id}\>\'s Minesweeper game\*\* \n` + render(board,size,0) + `\n\n\*\*How to play\?\*\*\nType the coordinate you want to clear\.\nAdd \"F\" at the end to flag a coordinate\n\*\*Ex\:\*\*C4F\n\n To stop the game type \'end\'`)
		} else {
			if (4 <= args[0] && args[0] <=9) {
				var size = args[0]
				if(!Number(args[1])) {
					var bombs = Math.round(size*size/3.35);
				} else {
					var bombs = args[1]
					if (bombs >= size*size) {
						message.channel.send(`Invalid argument\: Bombs \(${bombs}\) for current size \(${size}\) can\'t be more than ${size*size-1}`)
						return;
					};
				}	
					var mineArray = minesweeper.generateMineArray({
						rows: size,
						cols: size,
						mines: bombs
					});
					var board = new minesweeper.Board(mineArray);
					var grid = board.grid();
					var gamemsg = await message.channel.send(`\*\*\<\@${message.author.id}\>\'s Minesweeper game\*\* \n` + render(board,size, 0) + `\n\n\*\*How to play\?\*\*\nType the coordinate you want to clear\.\nAdd \"F\" at the end to flag a coordinate\n\*\*Ex\:\*\*C4F\n\n To stop the game type \'end\'`)

			} else {
				message.channel.send("Invalid argument: Max size for a minesweeper game is 9 and min size is 4.")
			}
			
		}
		const filter = m => m.author === message.author;
		const collector = message.channel.createMessageCollector(filter, { idle: 60000 });

		collector.on('collect', collect => {
			var response = collect.content.toLowerCase();
			if (response.match("end")) {
				message.channel.send("Game ended.")
				collector.stop();
				return;
			}
				if (response.startsWith(`${guildPrefix}minesweeper`) + response.startsWith(`${guildPrefix}mines`) || response.startsWith(`${guildPrefix}ms`)) {
					message.channel.send("Game state reset." + `\n` +"Reason: new game started")
					collector.stop();
					return;
				}
			if (!response.match(/([a-i])+([1-9])/gi)) return;
			if (response.split("").length < 2 || 4 < response.split("").length) {
							return;
						} else {
						var split = response.split("");
						var x,y;
						switch (split[0]) {
							case "a": 
								x=0;
								break;
							case "b": 
								x=1;
								break;
							case "c": 
								x=2;
								break;
							case "d": 
								x=3;
								break;
							case "e": 
								x=4;
								if (4<size) {break} else {return;}
							case "f": 
								x=5;
								if (5<size) {break} else {return;}
							case "g": 
								x=6;
								if (6<size) {break} else {return;}
							case "h": 
								x=7;
								if (7<size) {break} else {return;}
							case "i": 
								x=8;
								if (8<size) {break} else {return;}
						}
						y=Number(split[1])-1;
						if(!split[2]) {
							board.openCell(x,y);
							grid = board.grid();
							state = check(board.state());
							
							if (state === 0) {gamems(gamemsg, board, size, state, message)};
							if (state === 1) {gamems(gamemsg, board, size, state, message)};
							if (state === 2) {
								collector.stop();
								message.channel.send(`\*\*\<\@${message.author.id}\>\'s Minesweeper game\*\*\n${render(board,size,2)}\n\nOh no! You dug a bomb.`);
							}
							if (state === 3) {
								collector.stop();
								message.channel.send(`\*\*\<\@${message.author.id}\>\'s Minesweeper game\*\*\n${render(board,size,3)}\n\nCongrats\! You found all bombs.`);
							}
						} else {
							if(split[2] = "f") {
								board.cycleCellFlag(x,y)
								grid = board.grid();
								state = check(board.state());
								
								if (state === 0) {gamems(gamemsg, board, size, state, message)};
								if (state === 1) {gamems(gamemsg, board, size, state, message)};
								if (state === 2) {
									collector.stop();
									message.channel.send(`\*\*\<\@${message.author.id}\>\'s Minesweeper game\*\*\n${render(board,size,2)}\n\nOh no! You dug a bomb.`);
								}
								if (state === 3) {
									collector.stop();
									message.channel.send(`\*\*\<\@${message.author.id}\>\'s Minesweeper game\*\*\n${render(board,size,3)}\n\nCongrats\! You found all bombs.`);
								}
							} else {
								board.openCell(x,y);
								grid = board.grid();
								state = check(board.state());
								
								if (state === 0) {gamems(gamemsg, board, size, state, message)};
								if (state === 1) {gamems(gamemsg, board, size, state, message)};
								if (state === 2) {
									collector.stop();
									message.channel.send(`\*\*\<\@${message.author.id}\>\'s Minesweeper game\*\*\n${render(board,size,2)}\n\nOh no! You dug a bomb.`);
								}
								if (state === 3) {
									collector.stop();
									message.channel.send(`\*\*\<\@${message.author.id}\>\'s Minesweeper game\*\*\n${render(board,size,3)}\n\nCongrats\! You found all bombs.`);
								}
							}
						}
						}	
          })
		}
}