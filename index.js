require('dotenv').config()
require('./database')

const GitHub = require('./github')

GitHub.setCredentials({
    username: process.env.GITHUB_USERNAME,
    password: process.env.GITHUB_PASSWORD,
    token: process.env.GITHUB_TOKEN
})

const prefix = process.env.PREFIX

const { Client } = require('discord.js')

const { join } = require('path')

const client = new Client()

const insertCommands = require('./Utils/insertCommands')

insertCommands(client, join(__dirname, 'commands'))

client.on('ready', _ => {
    console.log(`Ready to work.`)
    require('./Tests/command')(client, prefix)
})

client.on('message', message => {
    if (message.content === 'Fagner') message.reply(`My god.`)

    if (message.content.startsWith(prefix)) require('./events/command')(client, message, prefix)
})


client.login(process.env.TOKEN)