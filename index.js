require('dotenv').config()

const DiscordRobot = require('./robots/Discord')
const CommandRobot = require('./robots/Command')

async function start() {
    const discordRobot = await DiscordRobot()

    // Inserts all the valid commands into a new Collection called 'commands'
    CommandRobot({ discordRobot })
    discordRobot.commands.get('hi').run()

}

start()