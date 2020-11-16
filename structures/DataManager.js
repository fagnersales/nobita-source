module.exports = class DataManager {
    constructor({ client, message, args, contents, embeds }) {
        this.client = client
        this.message = message
        this.args = args

        this.messageContents = contents
        this.embedContents = embeds
    }

    async sendChannelMessage({ code, params }) {
        const content = this.getMessageContent({ code, params })
        return this.message.channel.send(content)
    }

    async sendChannelEmbed({ code, params }) {
        const embed = this.getEmbedContent({ code, params })
        return this.message.channel.send(embed)
    }

    getMessageContent({ code, params }) {
        const language = params.language || 'en-us'
        return this.messageContents[code][language](params)
    }

    getEmbedContent({ code, params }) {
        const language = params.language || 'en-us'
        const device = params.device || 'desktop'
        return this.embedContents[code][device][language](params)
    }

    async buttonFy({ callbacks, collectorOptions }) {

        const buttons = Object.keys(callbacks)

        const filter = (reaction, user) => buttons.includes(reaction.emoji.name) && !user.equals(message.client.user)

        this.message.createReactionCollector(filter, collectorOptions || { max: Infinity, time: 500000 })
            .on('collect', reaction => callbacks[reaction.emoji.name]())

    }
}