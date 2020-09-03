const fs = require('fs-extra');
const { Client, MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

const client = new Client();
client.once('ready', () => {
    console.log('Ready!');
    client.user.setActivity('with computers');
});

const prefix = '!';
const commands = {
    commands: (msg) => mCommands(msg),
    btc: (msg) => btc(msg),
    shut: (msg) => shut(msg),
};

for (let command in commands)
    client.on('message', (msg) => msg.content.trim().split(/ +/)[0] === `${prefix}${command}` && commands[command](msg));

client.login(fs.readJsonSync(require('path').join(__dirname, 'auth.json')).token);

function mCommands(msg) {
    let text = '';
    for (let command in commands) text = `${text}\`>${command}\`\n`;

    let embed = new MessageEmbed()
        .setTitle('Bot commands')
        .setColor(0xFFFF00)
        .setDescription(text);
    msg.channel.send(embed);
}

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

function shut(msg) {
    let embed = new MessageEmbed()
        .setColor(0x0B1308)
        .setImage(`https://shutplea.se/`)
    msg.channel.send(embed);
    msg.delete();
}
