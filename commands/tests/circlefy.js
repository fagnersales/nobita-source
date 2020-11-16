const { MessageAttachment } = require('discord.js')
const { EventEmitter } = require('events')

const Jimp = require('jimp')

const circlefy = require('../../nibo/circlefy')

module.exports = {
    name: 'circlefy',
    run: class extends EventEmitter {
        constructor(data) {
            super()
            this.setup(data)
        }

        async setup({ client, message, args, database }) {

            const user = await client.users.fetch(message.author.id).catch(() => client.user)

            const background = await Jimp.read('https://cdn.discordapp.com/attachments/664100020043251712/775108087073079347/Bem_vindo.png')

            const img = await circlefy(user.displayAvatarURL({ format: 'png', size: 256 }))

            img.resize(220, Jimp.AUTO)

            background.composite(img, (background.getWidth() / 2) - (img.getWidth() / 2), (background.getHeight() / 2) - (img.getHeight() / 2) - 30)

            background.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
                (message.channel || client.channels.cache.get(message.channel_id)).send(new MessageAttachment(buffer, 'image.png'))
            })

        }
    }
}