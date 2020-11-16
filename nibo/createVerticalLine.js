/**
 * @typedef {(
 * 'up'   |
 * 'down' |
 * 'left' |
 * 'right'
 * )} Direction
 */

/**
 * @typedef {Object} VerticalLineData
 * @property {JimpImage} image
 * @property {Number} x
 * @property {String} line
 * @property {Number} color
 * @property {{value: Number, direction: Direction}} thickness
 */

const createThickness = require('./thickness')

/**
 * @param {VerticalLineData} data 
 */
function createVerticalLine(data) {

    const [start, end] = data.line === "0-0" ? "1-1" : data.line.split('-').sort()

    for (let i = 0; i <= end; i++) {
        const point = +start + i
        data.image.setPixelColor(data.color, data.x, point)
        if (data.thickness) {
            createThickness({
                color: data.color,
                direction: data.thickness.direction,
                image: data.image,
                value: data.thickness.value,
                y: point,
                x: data.x
            })
        }
    }
}

module.exports = createVerticalLine