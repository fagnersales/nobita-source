module.exports = class BaseCommand {
    constructor(data) {
        Object.assign(this, data)
    }

    sayHi() {
        console.log(this.name)
    }

}