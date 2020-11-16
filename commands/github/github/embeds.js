const { MessageEmbed } = require("discord.js")


const devices = {
    MOBILE: 'mobile',
    DESKTOP: 'desktop'
}

const languages = {
    PORTUGUESE: 'pt-br',
    ENGLISH: 'en-us'
}

const mapUserRepositories = {
    [devices.DESKTOP]: {
        [languages.PORTUGUESE]: repo => `[\`\`\`css\n[${repo.description}]\n| ⭐- ${repo.stargazers_count} | 👀 - ${repo.watchers_count}\`\`\`](${repo.html_url})`,
        [languages.ENGLISH]: repo => `[\`\`\`css\n[${repo.description}]\n| ⭐- ${repo.stargazers_count} | 👀 - ${repo.watchers_count}\`\`\`](${repo.html_url})`
    },
    [devices.MOBILE]: {
        [languages.PORTUGUESE]: repo => `> ${repo.description}\n(⭐- ${repo.stargazers_count} | 👀 - ${repo.watchers_count}) [📁](${repo.html_url})`,
        [languages.ENGLISH]: repo => `> ${repo.description}\n(⭐- ${repo.stargazers_count} | 👀 - ${repo.watchers_count}) [📁](${repo.html_url})`,
    }
}

const resolveRepositoryFiles = files => files.reduce((acc, cur) => ({ ...acc, [cur.type]: [cur, ...(acc[cur.type] || [])] }), {})

const mapRepositoryFiles = {
    [devices.DESKTOP]: {
        [languages.PORTUGUESE]: file => `[${file.name}](${file.html_url})`,
        [languages.ENGLISH]: file => `[${file.name}](${file.html_url})`
    },
    [devices.MOBILE]: {
        [languages.PORTUGUESE]: file => `${file.name}`,
        [languages.ENGLISH]: file => `${file.name}`
    }
}


module.exports = {
    USER_REPOSITORIES: {
        [devices.DESKTOP]: {
            [languages.PORTUGUESE]: ({ repositories, author }) => ({
                embed: {
                    author: {
                        name: `Visualizando repositório de: ${author.name}.`,
                        iconURL: author.avatar_url,
                        url: author.html_url
                    },
                    color: '#2195f1',
                    footer: { text: '💻 | Clique na descrição do repositório para abrir no seu navegador.' },
                    description: repositories.map(mapUserRepositories[devices.DESKTOP][languages.PORTUGUESE]).slice(0, 10).join('')
                }
            }),
            [languages.ENGLISH]: ({ repositories, author }) => ({
                embed: {
                    author: {
                        name: `Viewing ${author.name}'s repository.`,
                        iconURL: author.avatar_url,
                        url: author.html_url
                    },
                    color: '#2195f1',
                    footer: { text: '💻 | Click on the repository description to open it on your browser.' },
                    description: repositories.map(mapUserRepositories[devices.DESKTOP][languages.ENGLISH]).slice(0, 10).join('')
                }
            })
        },
        [devices.MOBILE]: {
            [languages.PORTUGUESE]: ({ repositories, author }) => new MessageEmbed()
                .setAuthor(`Visualizando repositório de: ${author.name}.`, author.avatar_url, author.html_url)
                .setColor('#2195f1')
                .setFooter('📱 | Clique no 📁 para ir ao repositório.')
                .setDescription(repositories.map(mapUserRepositories[devices.MOBILE][languages.PORTUGUESE]).slice(0, 7).join('\n')),

            [languages.ENGLISH]: ({ repositories, author }) => ({
                embed: {
                    author: {
                        name: `Viewing ${author.name}'s repository.`,
                        iconURL: author.avatar_url,
                        url: author.html_url
                    },
                    color: '#2195f1',
                    footer: { text: '📱 | Click on 📁 to go to the repository.' },
                    description: repositories.map(mapUserRepositories[devices.MOBILE][languages.ENGLISH]).slice(0, 7).join('\n')
                }
            })
        }
    },
    REPOSITORY_DATA: {
        [devices.DESKTOP]: {
            [languages.PORTUGUESE]: ({ repositoryData, owner, repositoryName }) => {
                const REPOSITORY_URL = `https://www.github.com/${owner.login}/${repositoryName}/`
                const resolvedFiles = resolveRepositoryFiles(repositoryData)

                return {
                    embed: {
                        author: {
                            name: `Clique aqui para ir até este repositório.`,
                            iconURL: owner.avatar_url,
                            url: REPOSITORY_URL
                        },
                        color: '#2195f1',
                        description: `> Arquivos:\n${resolvedFiles.file.map(mapRepositoryFiles[devices.DESKTOP][languages.PORTUGUESE])}\n> Pastas:\n${resolvedFiles.dir.map(mapRepositoryFiles[devices.DESKTOP][languages.PORTUGUESE])}`,
                        footer: { text: `💻 | Você está visualizando o repositório ${repositoryName} de ${owner.name}.` }
                    }
                }
            },
            [languages.ENGLISH]: ({ repositoryData, owner, repositoryName }) => {
                const REPOSITORY_URL = `https://www.github.com/${owner.login}/${repositoryName}/`
                const resolvedFiles = resolveRepositoryFiles(repositoryData)

                return {
                    embed: {
                        author: {
                            name: `Click here to go to this repository.`,
                            iconURL: owner.avatar_url,
                            url: REPOSITORY_URL
                        },
                        color: '#2195f1',
                        description: `> Files:\n${resolvedFiles.file.map(mapRepositoryFiles[devices.DESKTOP][languages.PORTUGUESE])}\n> Directories:\n${resolvedFiles.dir.map(mapRepositoryFiles[devices.DESKTOP][languages.PORTUGUESE])}`,
                        footer: { text: `💻 | You're viewing the repository ${repositoryName} from ${owner.name}.` }
                    }
                }
            }
        }
    }
}