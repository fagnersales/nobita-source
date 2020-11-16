const CommandExtensions = require("../../structures/CommandExtensions")

const { MessageEmbed } = require("discord.js")

const github = require("../../github")

module.exports = {
    name: 'githubgists',
    run: class extends CommandExtensions {
        constructor(data) {
            super()
            this.name = 'githubgists'
            this.setup(data)
        }

        async setup({ client, message, args }) {

            // if (!message.channel && message.webhook_id) message.channel = client.channels.cache.get(message.channel_id)
 
            //  const userProfile = await github.getGitHubUserProfile(args[0] || 'fagnersales')

            //  const userGists = await github.getGists(args[0] || 'fagnersales')

            //  if (!userGists) return message.channel.send(`Este usuário não tem nenhum gist criado ainda.`)

            //  const mapGists = gist => {
            //      const fisrtFile =  Object.keys(gist.files)[0]
            //      const lengthToReplace = fisrtFile.length + gist.html_url.length
            //      return `[${fisrtFile}](${gist.html_url}) - ${gist.description}`.substring(0, lengthToReplace + 50) + '...'
            //  }

            //  const availableGistsEmbed = new MessageEmbed()
            //      .setDescription(userGists.map(mapGists).join('\n'))
            //      .setFooter(`Viewing gists from: ${userProfile.username} | Followers: ${userProfile.followers}`, userProfile.avatarURL)
            //      .setColor('#0abcf7')

            //  message.channel.send(availableGistsEmbed)

            //  githubGists.getGistContent(userGists[0].id)

            // var me = github.getUser()
            // const myGists = await me.listGists()

            // const availableGists = await Promise.all(myGists.data.filter(gist => gist.public)
            //     .map(async gist => (await github.getGist(gist.id)).read()))

            // const test = availableGists.reduce((acc, gist) => {
            //     const file = Object.values(gist.data.files)[0]
            //     return acc.set(gist.data.id, {
            //         filename: file.filename, content: file.content.substring(0, 2000)
            //     })
            // }, new Map())

            // message.channel.send(`Desuclpa é que vai levar mt tempo pra deixar bonitinho`)

            // message.channel.send(test.get('d06419ecd144752dd00690cc51124724').content)

            // test.forEach((gist, gistID) => {
            //     message.channel.send(`> **${gist.filename}**\n\n${gist.content}\n----`)
            // })
            // const availableGists = myGists.

            // const firstGist = await github.getGist(myGists.data[0].id)

            // const firstGistContent = (await firstGist.read()).data.files['Push.md'].content

            // this.debugg(firstGistContent.replace('###', '>').replace('##', '>'))
            // message.channel.send(firstGistContent.replace('###', '>').replace('##', '>'))

        }
    },
    test: {
        contents: ['!githubgists gsilano'],
        ifQuestioned: [{
            unespecificString: 'Não sei o que lhe responder.',
            specificString: 'Não',
            unespecificReaction: ['😀'],
        }
        ]
    }
}