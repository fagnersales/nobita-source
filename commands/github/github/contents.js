module.exports = {
    OWNER_NOT_FOUND: {
        'pt-br': ({ owner }) => `\`${owner}\` não foi encontrado.`,
        'en-us': ({ owner }) => `\`${owner}\` was not found.`
    },
    REPOSITORY_NOT_FOUND: {
        'pt-br': ({ repositoryName, owner }) => `Repositório \`${repositoryName}\` não foi encontrado no usuário \`${owner.name}\`.`,
        'en-us': ({ repositoryName, owner }) => `Repository \`${repositoryName}\` was not found on \`${owner.name}\`'s account.`
    }
}