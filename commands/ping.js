const { EventEmitter } = require('events')

module.exports = {
    name: 'ping',
    run: class extends EventEmitter {
        constructor(data) {
            super()
            this.setup(data)
        }

        async setup({ client, message, args }) {

            console.log(args)

            const messageSent = await message.channel.send(`Meu ping atualmente é \`????\`!`)

            return `Message sent: ${messageSent.content}, command called by: ${message.author.tag}`
        }
    }
}