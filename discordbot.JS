const fs = require('fs-extra');
const { Client, MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

const client = new Client();
client.once('ready', () => {
    console.log('Ready!');

    // Set a status ("Playing some status")
    client.user.setActivity('custom status');

    // Uncomment either of these to use something other than "PLaying"
    //client.user.setActivity('custom status', { type: "WATCHING" });
    //client.user.setActivity('custom status', { type: "LISTENING" });
});

// Use this to change the prefix
const prefix = '!';

// To add a new command, add a line here with this format:
//      command: (msg) => function(msg),
// where "command" is the bot command and "function" is the function to call
const commands = {
    commands: (msg) => mCommands(msg),
    btc: (msg) => btc(msg),
    shut: (msg) => shut(msg),
};

// This just goes through every command and makes a listener.
// This is really inneficient and I'm working on improving it
for (let command in commands)
    client.on('message', (msg) => {
        if (!msg.content.startsWith(prefix) || msg.author.bot) return;
        msg.content.trim().split(/ +/)[0] === `${prefix}${command}` && commands[command](msg);
    });

// This line should be left alone
client.login(fs.readJsonSync(require('path').join(__dirname, 'auth.json')).token);

// This function shows you all the commands you have access to.
// It's really bad because it doesn't resond to permissions and
// doesn't have descriptions
function mCommands(msg) {
    let text = '';
    for (let command in commands) text = `${text}\`>${command}\`\n`;

    let embed = new MessageEmbed()
        .setTitle('Bot commands')
        .setColor(0xFFFF00)
        .setDescription(text);
    msg.channel.send(embed);
}

// Bitcoin price in USD
function btc(msg) {
    fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
        .then((res) => res.json())
        .then((json) => json.bpi.USD.rate)
        .then((price) => new MessageEmbed()
            .setTitle('Current Bitcoin Price (USD)')
            .setColor(0xF79019)
            .setDescription(`$${price}`)
            .setAuthor('https://www.coindesk.com/coindesk-api'))
        .then((embed) => msg.channel.send(embed));
}

// Shut up
function shut(msg) {
    let embed = new MessageEmbed()
        .setColor(0x0B1308)
        .setImage(`https://shutplea.se/`)
    msg.channel.send(embed);
    msg.delete();
}
