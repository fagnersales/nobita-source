/**
* @typedef {Object} AskOptionDataOptions
* @property {Boolean} [sensitivity=true] If the question should ignore LowerCase/UpperCase `default true`
* @property {Boolean} [returnLowerString=false] `true` If the user answer must return in lower case or `false` If the user answer must return without changes `default false`
* @property {Number} [max=1] Number of times that the user can answer it`default 1`
* @property {Number} [time=30000] Amount of time that the question can wait in miliseconds `default 30000`
* @property {Boolean} [resolveOnEndTime] When the message collector is ended (it means that the user did not answer the amount `max` of times)`True` if the function should resolve the promise with the messages or `false` with a falsy value `default false`
*/

/**
* @typedef {Object} AskOptionData
* @property {import('discord.js').UserResolvable} user Who will be asked
* @property {String[]} inputs Available options for this question
* @property {TextChannel} channel The channel where the question will be done
* @property {String} question Content that will be sent on the channel
* @property {AskOptionDataOptions} options
*/

module.exports = {
    resolveAskOptionDataOptions
}