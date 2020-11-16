const { Client } = require("discord.js")

async function start() {
    try {
        const client = new Client()
        await client.login(process.env.token)
        console.log(`> DiscordRobot: Inicializado com sucesso!`)
        return client
    } catch (error) {
        console.log(`DiscordRobot: Erro ao inicializar!`, error)
    }
}

module.exports = start