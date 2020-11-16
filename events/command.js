const database = require('firebase').database()

module.exports = (client, message, prefix) => {

    if (message.author.bot) return null

    const commandName = message.content.split(' ')[0].slice(prefix.length)

    if (client.commands.has(commandName)) {

        const args = message.content.split(' ').slice(1)

        const command = client.commands.get(commandName)

        new command.run({ client, message, args, database })
    }

}