const { WebhookClient } = require("discord.js")

module.exports = async (client, prefix) => {

    const testCommand = async (client, commandName) => {

        const command = client.commands.get(commandName)

        if (command) {

            const hook = new WebhookClient('775037952777650189', 'N3qot-VqqufGB8_8i3LQJvfxKhnNpBNMhJ26vjtdSOKgKmH5r3C5B_KGiT7dLCsHOVhY')

            const commandData = command.test

            if (!commandData) {
                const message = await hook.send(`Test for the command \`${commandName}\`. Any content provided.`)
                message.channel = client.channels.cache.get(message.channel_id)
                return new command.run({ client, message })
                    .on('debugg', console.log)
            }

            runCommand()

            async function runCommand(contentIndex = 0) {
                const message = await hook.send(commandData.contents[contentIndex])

                const args = message.content.split(' ').slice(1)

                new command.run({ client, message, args })
                    .on('debugg', console.log)
                    .on('questioned', (question, time, data) => {
                        if (commandData.ifQuestioned[time]) {
                            if (data.mode === 'string') {
                                if (commandData.ifQuestioned[time][data.type]) {
                                    hook.send(data.random ? data.options[Math.floor(Math.random() * data.options.length)] : commandData.ifQuestioned[time][data.type])
                                }
                            }
                        }
                    })
                    .on('end', _ => {
                        if (commandData.contents[contentIndex + 1]) runCommand(contentIndex + 1)
                    })
            }

        }
    }

    const commandsToTest = ['github']

    for (const commandName of commandsToTest) await testCommand(client, commandName)

}