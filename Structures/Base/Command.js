const { User, TextChannel, Message, Collection, DMChannel } = require('discord.js')

/**
 * @typedef {import('./AskOption').AskOptionData} AskOptionData
 * @typedef {import('./AskOption').AskOptionDataOptions} AskOptionDataOptions
 */

module.exports = class BaseCommand {
    constructor(data) {
        Object.assign(this, data)
    }

    setDiscordRobot(discordRobot) {
        this.discordRobot = discordRobot
    }

    /** @param {AskOptionData} AskOptionData */
    async askOption(AskOptionData) {
        const user = await this.resolveUser(AskOptionData.user)

        if (!user) throw new Error('BaseCommandError: Could not find a user.')

        const inputs = AskOptionData.inputs

        if (!inputs) throw new Error('BaseCommandError: You must provide at least one input on inputs array.')

        if (!Array.isArray(inputs)) throw new Error('BaseCommandError: Inputs must be the type of Array.')

        for (const input of inputs) {
            if (typeof input !== 'string') throw new Error('BaseCommandError: Invalid input, all of them must be the type of String.')
        }

        if (!AskOptionData.channel) throw new Error('BaseCommandError: Could not find a channel.')

        const { channel, question } = AskOptionData

        if (!channel || !channel instanceof TextChannel || !channel instanceof DMChannel) throw new Error('BaseCommandError: AskOptionData#channel is required and must be the type of TextChannel or DMChannel')

        if (!question) throw new Error('You must specify a question to be sent on the channel.')

        await channel.send(question)

        const {
            sensitivity,
            returnLowerString,
            max,
            time,
            resolveOnEndTime
        } = resolveAskOptionDataOptions(AskOptionData.options)

        return new Promise((resolve, _reject) => {

            const filter = message => {
                return message.author.equals(user)
                    && (sensitivity ?
                        inputs.some(input => input.toLowerCase() === message.content.toLowerCase()) :
                        inputs.some(input => input === message.content)
                    )
            }

            channel.createMessageCollector(filter, { max, time })
                .on('end', collectorEnd)

            // #region onEnd

            /**
             * @param {Collection<String, Message>} collectedMessages 
             * @param {'limit'|'channelDelete'|'time'} reason 
             */
            function collectorEnd(collectedMessages, reason) {
                if (reason === 'limit') return endLimit(collectedMessages)
                if (reason === 'time') return endTime(collectedMessages)
            }
            
            /** @param {Collection<String, Message>} collectedMessages */
            function endLimit(collectedMessages) {
                const messagesContent = (returnLowerString ?
                    collectedMessages.map(message => message.content.toLowerCase()) :
                    collectedMessages.map(message => message.content)
                )
                resolve(messagesContent)
            }

            /** @param {Collection<String, Message>} collectedMessages */
            function endTime(collectedMessages) {
                const messagesContent = (returnLowerString ?
                    collectedMessages.map(message => message.content.toLowerCase()) :
                    collectedMessages.map(message => message.content)
                )
                resolveOnEndTime ? resolve(messagesContent) : resolve(null)
            }

            // #end
        })

        /**
         * @param {AskOptionDataOptions} AskOptionDataOptions
         * @returns {{
         * sensitivity: Boolean,
         * returnLowerString: Boolean,
         * max: Number,
         * time: Number,
         * resolveOnEndTime: Boolean
         * }}
         */
        function resolveAskOptionDataOptions(AskOptionDataOptions) {
            return {
                sensitivity: true,
                returnLowerString: false,
                max: 1,
                resolveOnEndTime: false,
                ...AskOptionDataOptions
            }
        }
    }

    /** 
     * @param {User|String} user
     * @returns {Promise<User>}
     */
    async resolveUser(user) {
        return this.discordRobot.users.fetch(user.id ? user.id : user.replace(/[^\d]/g, ''))
    }
}