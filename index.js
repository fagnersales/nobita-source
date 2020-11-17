require('dotenv').config()

const DiscordRobot = require('./robots/Discord')
const CommandRobot = require('./robots/Command')
const EventRobot = require('./robots/Event')
async function start() {
    const discordRobot = await DiscordRobot()

    CommandRobot({ discordRobot })
    EventRobot({ discordRobot, whenReady: ['syncedtest', 'syncedtest2'] })

}

start()