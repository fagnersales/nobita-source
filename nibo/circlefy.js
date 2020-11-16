const Jimp = require('jimp')

const createCircleMask = require('./createCircleMask')

module.exports = async _image => {
    const image = typeof _image === 'string' ? await Jimp.read(_image) : _image

    return image.mask(createCircleMask(image.getWidth(), image.getHeight()), 0, 0)
}