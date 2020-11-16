const createRec = require("./createRectangle")

module.exports = (w, h) => {
    const full = createRec(w, h, 'black')
    const minor = createRec(w, h, 'white')
    minor.circle({ radius: (w + h) / 4 + 1, x: minor.getWidth() / 2, y: minor.getHeight() / 2 })
    return full.composite(minor, 0, 0)
}