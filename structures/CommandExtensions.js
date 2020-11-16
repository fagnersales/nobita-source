const { EventEmitter } = require('events')

class CommandExtensions extends EventEmitter {
    constructor() {
        super()
        this.emits = 0
    }

    emitQuestion = (message, data) => {
        this.emit('questioned', message, this.emits, data)
        this.emits = this.emits + 1
    }

    debugg = (...data) => console.log(this.name, ...data)

    async resolveMessage(client, message) {
        if (!message.channel && message.webhook_id) message.channel = await client.channels.fetch(message.channel_id)
        if (!message.guild && message.webhook_id) message.guild = message.channel.guild

        return message
    }

    async askContent({ message, content, user, collectorOptions }) {
        const msg = await message.channel.send(content)

        return new Promise(resolve => {

            this.emitQuestion(msg, 'unespecificString')

            const filter = m => m.content && m.author.equals(user)

            const onEnd = (collectedMessages, reason) => {
                if (reason === 'limit') resolve(collectedMessages.map(({ content }) => content))
                else resolve(reason)
            }

            message.channel.createMessageCollector(filter, collectorOptions).on('end', onEnd)
        })
    }

    async askOption({ message, content, user, options, collectorOptions }) {
        const msg = await message.channel.send(content)

        return new Promise(resolve => {
            this.emitQuestion(msg, { type: 'specificString', options, random: true, mode: 'string' })

            const filter = m => m.content && m.author.equals(user) && options.some(option => option.toLowerCase() === m.content.toLowerCase())

            const onEnd = (collectedMessages, reason) => {
                if (reason === 'limit') resolve(collectedMessages.map(({ content }) => content))
                else resolve(reason)
            }

            message.channel.createMessageCollector(filter, collectorOptions).on('end', onEnd)
        })
    }

}

module.exports = CommandExtensions