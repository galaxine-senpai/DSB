module.exports = {
    name: "staff",
    category: "info",
    description: "Lists All Staff Of DSB",
    usage: "[command]",
    run: async (client, message, args) => {
      
      function getAll(client, message) {
    let embed = new MessageEmbed()
        .setColor("#FFDFD3")
        .setTitle('Staff List Of DSB!')
        .setURL('https://cdn.discordapp.com/attachments/760546704582901810/797042688892338196/video0_1.mp4')
        .addDiscription("")
        .addField("Owners:", `Sopy & Gawaxine`)
        .addField("Devs:", `Sopy & Gawaxine`)
        .setFooter("Thanks to you all!!!")
        }
    message.channel.send(embed)
    }
}

