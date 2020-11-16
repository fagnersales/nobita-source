const Jimp = require('jimp')

const verticalLine = require('./createVerticalLine')

module.exports = createRectangle = (width, height, color) => {

    if (isNaN(width)) width = +width
    if (isNaN(height)) height = +height

    if (isNaN(width) || isNaN(height)) throw new Error('value for width or height must be the type of numbers.')

    if (!color) color = 0
    else if (!isNaN(color)) color = +color
    else if (typeof color == 'string') color = Jimp.cssColorToHex(color.toUpperCase())

    const image = new Jimp(width, height, color)

    verticalLine({
        image,
        color,
        line: `${height}-0`,
        x: 0,
        thickness: {
            value: width,
            direction: 'right'
        }
    })

    return image
}