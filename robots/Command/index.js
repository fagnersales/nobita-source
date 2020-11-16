const { Client, Collection } = require('discord.js')

const { readdirSync } = require('fs')

const { join } = require('path')

/**
 * @typedef {object} CommandRobotStartDataOptions
 * @property {class} [Base] Class to be instanciated by all the commands
 * @property {string} [path] Path to the commands folder (default: './commands')
 * @property {function} [filter] Filter to pass through each file (default: )
 */

/**
 * Inserts into the Client Instance a new collection called 'commands' with a list of commands to be used
 * 
 * @param {Object} CommandRobotStartData Data for CommandRobotStart
 * @param {Client} CommandRobotStartData.discordRobot The client instance that will have the commands loaded
 * @param {String | String[]} [CommandRobotStartData.blacklist] Commands name or folders that shouldn't be loaded
 * @param {CommandRobotStartDataOptions} [CommandRobotStartData.options] Options 
 * 
 * @returns {Promise<undefined>}
 */
async function start(CommandRobotStartData) {

    if (!CommandRobotStartData || typeof CommandRobotStartData !== 'object') throw Error('> CommandRobot: Start method expects a object parameter...')

    const resolvedStartData = resolveData(CommandRobotStartData)

    insertAllFilesIntoCollection(resolvedStartData.collection, resolvedStartData.options.filter, resolvedStartData.options.path)
}

function resolveData(CommandRobotStartData) {

    const resolvedData = { ...CommandRobotStartData }

    const {
        discordRobot,
        blacklist,
        options
    } = CommandRobotStartData

    if (discordRobot) resolvedData.discordRobot = discordRobot || {}

    if (discordRobot.commands) resolvedData.discordRobot.commands = discordRobot.commands || new Collection()


    if (blacklist && typeof blacklist !== 'string' && !Array.isArray(blacklist)) throw new Error('> CommandRobot: Invalid value for blacklist. Expects Array or String. Got:', blacklist)

    if (options && typeof options !== 'object') throw new Error('> CommandRobot: Invalid value for options. Expects an Object. Got:', options)

    if (typeof blacklist === 'string') resolvedData.blacklist = [blacklist]

    if (!options) resolvedData.options = {}

    const {
        Base,
        path,
        filter
    } = (options || {})

    if (!filter) resolvedData.options.filter = function (file) {

        const isWithlisted = name => !resolvedData.blacklist.some(blocked => blocked.toLowerCase() === name.toLowerCase())

        if (file.type === 'file') {
            return file.name.endsWith('js')
                && file.exports.name
                && file.exports.description
                && isWithlisted(file.name)
        } else {
            return file.type === 'dir' && isWithlisted(file.name)
        }

    }

    if (!path) resolvedData.options.path = join(__dirname, '..', '..', 'commands')

    if (!Base) resolvedData.options.Base = class { }

    return resolvedData
}

/**
 * 
 * @param {Collection} collection Collection to set the loaded files 
 * @param {function} filter Weither the file can be saved or not
 * @param {string} path Directory path to start reading
 */
function insertAllFilesIntoCollection(collection, filter, path) {
    const files = readdirSync(path, { withFileTypes: true })

    if (!files) throw new Error(`No such file or directory on path: ${path}`)

    for (const file of files) {

        const fileType = file.isFile() ? 'file' : file.isDirectory() ? 'dir' : 'any'

        const isValid = filter({
            name: file.name,
            type: fileType,
            exports: fileType === 'file' ? require(join(path, file.name)) : {}
        })

        console.log(`> CommandRobot: ${file.name} ${isValid ? 'is valid' : 'is not valid'}.`,)

    }
}

module.exports = start