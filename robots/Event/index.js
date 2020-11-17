const { Client } = require("discord.js")

const { readdirSync } = require('fs')
const { join } = require("path")

/**
 * 
 * @param {Object} EventRobotStartData Data for this robot
 * @param {Client} EventRobotStartData.discordRobot Client Instance that will evoke the events
 * @param {String} [EventRobotStartData.path] Optional custom path (default: '../../events')
 */
function start(EventRobotStartData) {
    const { discordRobot, path } = EventRobotStartData

    const eventsPath = (path && typeof path === 'string') ? join(path) : join(__dirname, '..', '..', 'events')

    console.log(`> EventRobot: Going to load all events on '${eventsPath}' depth: 1`)

    const eventFiles = readdirSync(eventsPath)

    if (!eventFiles) return console.log('> EventRobot: No such file on path:', eventsPath)

    if (eventFiles) {

        eventFiles.forEach(forEachFile)

        function forEachFile(file) {
            const eventFunction = require(join(eventsPath, file))
            const event = eventFunction.event || file.split('.')[0]

            try {
                discordRobot['on'](event, (...args) => eventFunction.run(...args, discordRobot))
                console.log(`> EventRobot: Event ${event} called successfully!`)
            } catch (error) {
                console.log(error)
            }

        }

    }
}

module.exports = start