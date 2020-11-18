const BaseCommand = require('../Structures/Base/Command')

module.exports = new class TestAskOptionCommand extends BaseCommand {
    constructor() {
        super()
        this.name = 'test#askoption'
        this.description = 'Test the AskOption base command.'
        this.category = 'test'
        }

    async run(message, discordRobot) {
        this.setDiscordRobot(discordRobot)
        
        const result = await this.askOption({
            user: message.author,
            channel: message.channel,
            question: 'Você gosta de batata? `sim` | `não`',
            inputs: ['Sim', 'Não'],
            options: {
                max: 1,
                resolveOnEndTime: false,
                returnLowerString: false,
                sensitivity: true,
                time: 30000
            }
        })

        if (result) {
            message.channel.send(`Resultado: \`${result}\``)
        } else {
            message.channel.send(`Sem resultado.`)
        }

        console.log(result)
    }
}