const { Collection } = require("discord.js")

const { readdirSync, lstatSync } = require('fs')

const { join } = require('path')

module.exports = (client, commandsPath) => {
    if (!client.commands) client.commands = new Collection()

    const findDirectories = path => readdirSync(path)
        .filter(file => lstatSync(join(path, file)).isDirectory())
        .map(file => join(path, file))

    const findFiles = path => readdirSync(path)
        .filter(file => lstatSync(join(path, file)).isFile() && file.endsWith('.js'))
        .map(file => join(path, file))

    const saveFile = filePath => {
        const command = require(filePath)

        if (command.name) {
            client.commands.set(command.name, command)
            console.log(`Command saved: ${command.name}`)
        }
    }

    const start = path => {
        findFiles(path).forEach(saveFile)
        findDirectories(path).forEach(start)
    }

    start(commandsPath)

}