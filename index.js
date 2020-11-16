require('dotenv').config()

const DiscordRobot = require('./robots/Discord')

async function start() {
    await DiscordRobot()
}

start()

