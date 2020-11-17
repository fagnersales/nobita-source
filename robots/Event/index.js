const { Client } = require("discord.js")

const { readdirSync, Dirent } = require('fs')
const { join } = require("path")

/**
 * 
 * @param {Object} EventRobotStartData Data for this robot
 * @param {Client} EventRobotStartData.discordRobot Client Instance that will evoke the events
 * @param {String} [EventRobotStartData.path] Optional custom path (default: '../../events')
 * @param {String|String[]} [EventRobotStartData.whenReady] Event names that should be called with the event Ready
 * 
 */
function start(EventRobotStartData) {
    const { discordRobot, path } = EventRobotStartData

    if (!EventRobotStartData.whenReady) EventRobotStartData.whenReady = []
    else if (typeof EventRobotStartData.whenReady === 'string') EventRobotStartData.whenReady = [EventRobotStartData.whenReady]

    const eventsPath = (path && typeof path === 'string') ? path : join(__dirname, '..', '..', 'events')

    console.log(`> EventRobot: Going to load all events on '${eventsPath}' depth: 1`)

    const eventFiles = readdirSync(eventsPath, { withFileTypes: true })

    if (!eventFiles) return console.log('> EventRobot: No such file on path:', eventsPath)

    eventFiles
        .filter(onlyJavaScriptFiles)
        .forEach(listenAllAvailableFiles)

    /** @param {Dirent} file */
    function listenAllAvailableFiles(file) {

        const eventFunction = require(join(eventsPath, file.name))
        const event = eventFunction.event || file.name.split('.')[0]

        try {
            if (EventRobotStartData.whenReady.includes(event)) {
                saveEvent('ready', eventFunction, event)
                console.log(`> EventRobot: Event ${event} synced with 'ready' event successfully!`)
            } else {
                saveEvent(event, eventFunction)
                console.log(`> EventRobot: Event ${event} loaded successfully!`)
            }


        } catch (error) {
            console.log(error)
        }

    }

    /** @param {Dirent} file */
    function onlyJavaScriptFiles(file) {
        return file.isFile()
            && file.name.endsWith('js')
            && isExportingEverything(join(eventsPath, file.name), 'run')
    }

    function isExportingEverything(path, ...props) {
        const file = require(path)
        for (const prop of props) {
            if (!file[prop]) return false
        }
        return true
    }
    function saveEvent(name, func, syncedName) {
        discordRobot['on'](name, (...args) => {
            if (syncedName) console.log(`> EventRobot: Calling the event ${syncedName}, synced with: ${name}`)
            else console.log(`> EventRobot: Calling the event: ${name}.`)
            func.run(...args, discordRobot)
        })
    }
}

module.exports = start