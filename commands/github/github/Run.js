const CommandExtensions = require("../../../structures/CommandExtensions")
const DataManager = require("../../../structures/DataManager")

const GitHub = require("../../../github")


const contents = require('./contents')
const embeds = require('./embeds')

module.exports = class extends CommandExtensions {
    constructor(data) {
        super()
        this.name = 'github'
        this.dataManager = new DataManager({ ...data, contents, embeds})
        this.resolveMessage(data.client, data.message).then(message => {
            this.setup({ client: data.client, message, args: data.args })
        })
    }

    async setup({ args }) {

        const github = new GitHub()

        const owner = args[0] || 'fagnersales'
        const repository = args[1]
        const dirpath = args[2] || ''

        const user = await github.getUser(owner)

        if (!user) return this.dataManager.sendChannelMessage({
            code: 'OWNER_NOT_FOUND',
            params: {
                owner,
                language: args[3]
            }
        }).then(_ => this.emit('end', 'OWNER_NOT_FOUND'))

        const handleRepositories = sentMessage => {
            this.emit('end', 'USER_RESPOSITORIES')

            sentMessage.react('😀')
        }

        const showUserRepositories = async () => this.dataManager.sendChannelEmbed({
            code: 'USER_REPOSITORIES',
            params: {
                repositories: await github.getRepos(owner),
                author: user,
                device: args[2],
                language: args[3]
            }
        }).then(handleRepositories)

        const showRepository = async () => github.getDirOnRepository({ owner, repository, dirpath })
            .then(data => {
                const repositoryNotFoundProps = {
                    code: 'REPOSITORY_NOT_FOUND',
                    params: {
                        owner: user,
                        repositoryName: repository
                    }
                }

                const repositoryFilesProps = {
                    code: 'REPOSITORY_DATA',
                    params: {
                        repositoryData: data,
                        owner: user,
                        repositoryName: repository,
                        language: 'pt-br',
                        device: 'desktop'
                    }
                }

                if (Array.isArray(data)) {

                    const handlePromiseEmbed = sentMessage => {
                        this.emit('end', 'REPOSITORY_DATA')

                        sentMessage.react('😀')
                    }

                    this.dataManager.sendChannelEmbed(repositoryFilesProps).then(handlePromiseEmbed)
                }
                else this.dataManager.sendChannelMessage(repositoryNotFoundProps).then(_ => this.emit('end', 'REPOSITORY_NOT_FOUND'))
            })


        return repository ? showRepository() : showUserRepositories().then(_ => this.emit('end', 'SHOW_USER_REPOSITORIES'))

    }
}