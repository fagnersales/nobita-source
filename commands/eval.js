const { EventEmitter } = require('events')

const { MessageEmbed } = require('discord.js')

const { inspect } = require('util')

module.exports = {
    name: 'eval',
    run: class extends EventEmitter {
        constructor(data) {
            super()
            this.setup(data)
        }

        async setup({ client, message, args, database }) {

            if (message.author.id === '474407357649256448') {

                try {

                    const code = args.join(' ')

                    const output = inspect(await eval(code)).substr(0, 1950)

                    message.channel.send(
                        new MessageEmbed()
                        .setDescription(`Entrada: \`\`\`js\n${code}\`\`\`\nSaída: \`\`\`js\n${output}\`\`\``)
                    )

                } catch (error) {
                    message.channel.send(
                        new MessageEmbed()
                        .setDescription(`Error:\n\`\`\`${error}\`\`\``)
                    )
                }
            }
        }
    }
}