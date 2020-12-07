const _ = require('lodash')
const { logger } = require('./logger')

/**
 *
 * @param {string} nric - usually nine chars long, eg ABCABCNRC
 * @return {string} *****NRC
 */
const maskNRIC = (nric = 'XXXXXXXNRC') => {
  const defaultLengthOfNRIC = 9
  if (_.isNull(nric)) {
    logger.warn('Provided NRIC which is null, return default')
    return 'XXXXXXXNRC'
  }
  if (nric.length !== defaultLengthOfNRIC) {
    logger.warn(
      'NRICs length is abnormal',
      nric.length,
      'trim it to a default length',
      defaultLengthOfNRIC
    )
    return maskChars(nric.substr(0, defaultLengthOfNRIC), 0, 3, '*')
  }
  const maskedData = maskChars(nric, 0, 3, '*')
  return maskedData
}

const maskChars = (input, startIndex, endIndex, mask) => {
  if (startIndex === -1 && endIndex === -1) {
    return setCharAll(input, mask)
  }

  for (let i = 0; i < input.length; i++) {
    if (i >= startIndex && i <= endIndex) {
      input = setCharAt(input, i, mask)
    }
  }
  return input
}

const setCharAt = (str, index, chr) => {
  if (index > str.length - 1) return str
  return str.substr(0, index) + chr + str.substr(index + 1)
}

const setCharAll = (str, chr) => {
  return str.replace(/./g, chr)
}

module.exports = {
  maskNRIC
}
