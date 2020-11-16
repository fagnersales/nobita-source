require('dotenv').config()

const DiscordRobot = require('./robots/Discord')
const CommandRobot = require('./robots/Command')

async function start() {
    // const discordRobot = await DiscordRobot()

    await CommandRobot({
        discordRobot: {},
        blacklist: 'blacklistedCommands',
        options: {
            
        }
    })


}

start()