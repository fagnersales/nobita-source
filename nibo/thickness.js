/**
 * @typedef {(
 * 'up'   |
 * 'down' |
 * 'left' |
 * 'right'
 * )} Direction
 */

/**
 * @typedef {Object} ThicknessData 
 * @property {JimpImage} image
 * @property {Number} x 
 * @property {Number} y 
 * @property {Number} value 
 * @property {Number} color
 * @property {Direction} direction 
 */

/**
 * 
 * @param {ThicknessData} data 
 */
function createThickness(data) {
    for (let i = 0; i < data.value; i++) {
        if (data.direction == "down") {
            data.image.setPixelColor(data.color, data.x, data.y + i)
        } else if (data.direction == "up") {
            data.image.setPixelColor(data.color, data.x, data.y - i)
        } else if (data.direction == "left") {
            data.image.setPixelColor(data.color, data.x - i, data.y)
        } else {
            data.image.setPixelColor(data.color, data.x + i, data.y)
        }
    }
}

module.exports = createThickness