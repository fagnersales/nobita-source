const Run = require('./run')

module.exports = {
    name: 'github', run: Run,
    test: {
        contents: ['!github'],
        ifQuestioned: [{
            unespecificString: 'Não sei o que lhe responder.',
            specificString: 'Não',
            unespecificReaction: ['😀'],
        }]
    }
}