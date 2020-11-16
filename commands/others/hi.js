const BaseCommand = require("../../Structures/Base/Command")

module.exports = new class Hi extends BaseCommand {
    constructor() {
        super()
        this.name = 'hi'
        this.description = 'make me say hi!'
        this.category = 'none'
    }

    async run() {
        this.sayHi()
    }
}