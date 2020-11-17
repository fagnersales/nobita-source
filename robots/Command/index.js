const { Client, Collection } = require('discord.js')

const { readdirSync } = require('fs')

const { join } = require('path')

/**
 * @typedef {object} CommandRobotStartDataOptions
 * @property {string} [path] Path to the commands folder (default: './commands')
 * @property {function} [filter] Filter to pass through each file (default: )
 */

/**
 * Inserts into the Client Instance a new collection called 'commands' with a list of commands to be used
 * 
 * @param {Object} CommandRobotStartData Data for CommandRobotStart
 * @param {Client} CommandRobotStartData.discordRobot The client instance that will have the commands loaded
 * @param {String | String[]} [CommandRobotStartData.blacklist] file or folders that shouldn't be loaded
 * @param {CommandRobotStartDataOptions} [CommandRobotStartData.options] Options 
 * 
 * @returns {undefined}
 */
function start(CommandRobotStartData) {

    if (!CommandRobotStartData || typeof CommandRobotStartData !== 'object') throw Error('> CommandRobot: Start method expects a object parameter...')

    const resolvedStartData = resolveData(CommandRobotStartData)

    resolvedStartData.discordRobot.commands = new Collection()

    insertAllFilesIntoCollection({
        discordRobot: resolvedStartData.discordRobot,
        filter: resolvedStartData.options.filter,
        path: resolvedStartData.options.path
    })

    console.log(`> CommandRobot: ${resolvedStartData.discordRobot.commands.size} Comandos carregados.`)
}

function resolveData(CommandRobotStartData) {

    const resolvedData = { ...CommandRobotStartData }

    const {
        discordRobot,
        blacklist,
        options
    } = CommandRobotStartData

    if (discordRobot) resolvedData.discordRobot = discordRobot || {}

    if (blacklist && typeof blacklist !== 'string' && !Array.isArray(blacklist)) throw new Error('> CommandRobot: Invalid value for blacklist. Expects Array or String. Got:', blacklist)

    if (!blacklist) resolvedData.blacklist = []

    if (options && typeof options !== 'object') throw new Error('> CommandRobot: Invalid value for options. Expects an Object. Got:', options)

    if (typeof blacklist === 'string') resolvedData.blacklist = [blacklist]

    if (!options) resolvedData.options = {}

    const {
        path,
        filter
    } = (options || {})

    if (!filter) resolvedData.options.filter = function (file) {

        const isBlacklisted = name => resolvedData.blacklist.some(blocked => blocked.toLowerCase() === name.toLowerCase())

        if (isBlacklisted(file.name)) {
            console.log(`> CommandRobot: ${file.name} is on blacklist!`)
            return false
        }
        if (file.type === 'file') {
            return file.extension === 'js'
                && file.exports.name
                && file.exports.description
                && file.exports.run
        } else {
            return file.type === 'dir'
        }

    }

    if (!path) resolvedData.options.path = join(__dirname, '..', '..', 'commands')

    return resolvedData
}

/**
 * @param {Object} insertAllFilesIntoCollectionData The data for this function
 * @param {Collection} insertAllFilesIntoCollectionData.collection Collection to set the loaded files 
 * @param {function} insertAllFilesIntoCollectionData.filter Weither the file can be saved or not
 * @param {string} insertAllFilesIntoCollectionData.path Directory path to start reading
 */
function insertAllFilesIntoCollection(insertAllFilesIntoCollectionData) {

    const { discordRobot, filter, path } = insertAllFilesIntoCollectionData

    const files = readdirSync(path, { withFileTypes: true })

    if (!files) throw new Error(`No such file or directory on path: ${path}`)

    for (const file of files) {

        const fileType = file.isFile() ? 'file' : file.isDirectory() ? 'dir' : 'any'
        const filePath = join(path, file.name)
        const fileExtension = fileType === 'file' ? file.name.split('.').reverse()[0] : 'any'
        const fileExports = fileExtension === 'js' ? require(filePath) : {}

        const fileData = {
            name: file.name,
            type: fileType,
            extension: fileExtension,
            path: filePath
        }

        const isValidFile = filter({ ...fileData, exports: fileExports })

        if (isValidFile && fileType === 'dir') insertAllFilesIntoCollection({
            ...insertAllFilesIntoCollectionData, path: join(path, file.name)
        })

        if (isValidFile && fileExtension === 'js') {
            if (discordRobot.commands.has(fileExports.name)) {
                const duplicatedCommand = discordRobot.commands.get(fileExports.name)

                console.log(`> CommandRobot: Command '${fileExports.name}' is duplicated! Found on files:`, [duplicatedCommand.data.name, file.name])

            }

            discordRobot.commands.set(fileExports.name, require(filePath))
            console.log(`> CommandRobot: ${file.name} loaded as '${fileExports.name}' successfully.`,)
        }
    }

}

module.exports = start