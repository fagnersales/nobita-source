const CommandExtensions = require("../../structures/CommandExtensions")

module.exports = {
    name: 'testar',
    run: class extends CommandExtensions {
        constructor(data) {
            super()
            this.setup(data)
        }


        async setup({ client, message, args }) {

            const voiceChannel = await client.channels.fetch('777169211210072084')

            await voiceChannel.leave()

            if (voiceChannel.joinable) {
                console.log('Joined the voice channel.')

                const fs = require('fs')
                const { execSync } = require("child_process")

                const connection = await voiceChannel.join()

                const fileID = Date.now()

                const readable = connection.receiver.createStream(client.users.cache.get('293618199977656332'), { mode: 'pcm', end: 'manual' })

                setTimeout(() => readable.end(), 10000)

                readable.pipe(fs.createWriteStream(`${fileID}`))

                readable.on('data', chunk => console.log(`Received ${chunk.length} bytes of data.`))

                readable.on('end', _ => {
                    console.log('Voice Recording ended.')
                    setTimeout(() => execSync(`ffmpeg -f s16le -ar 48k -ac 2 -i ${fileID} ${fileID}.mp3`), 2000)
                    setTimeout(() => connection.play(`${fileID}.mp3`), 4000)
                })

            }
        }
    },
    test: {
        contents: ['!testar'],
        ifQuestioned: [{
            unespecificString: 'Não sei o que lhe responder.',
            specificString: 'Não',
            unespecificReaction: ['😀'],
        }
        ]
    }
}