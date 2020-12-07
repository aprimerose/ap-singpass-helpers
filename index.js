const _ = require('lodash')
const axios = require('axios')
const jose = require('node-jose')
const { logger } = require('./logger')

/**
 * WIP
 * @param {} payload
 * @param {*} singpassPubkeyUrl
 * @param {*} singpassPubkeyId
 */
const verifyPayload = async (payload, singpassPubkeyUrl, singpassPubkeyId) => {
  logger.debug('Start verifying the payload')
  const keys = await fetchKeys(singpassPubkeyUrl)
  logger.debug(
    'Received keys from a public source',
    keys.length,
    'source them in a keystore'
  )
  return jose.JWK.asKeyStore(keys)
    .then(keystore => {
      logger.debug(
        'Get pubkey to createVerify the payload based on pubkey',
        singpassPubkeyId
      )
      const key = keystore.get(singpassPubkeyId)
      return jose.JWS.createVerify(key)
        .verify(payload.toString())
        .then(res => {
          logger.debug(
            'verified ok ',
            Object.keys(res),
            'start decoding the payload'
          )
          const payload = JSON.parse(res.payload.toString())
          logger.debug('payload decoded and returned from verifyJWS', payload)
          return payload
        })
    })
    .catch(err => {
      logger.error('Could not verify a payload', err, err.stack)
    })
}

/**
 * Download public keys verify and get the payload
 * @param {SingPass SAML Gov Sg} url
 */
const fetchKeys = async (
  url = 'https://stg-saml-internet.singpass.gov.sg/mga/sps/oauth/oauth20/jwks/SingPassOP'
) => {
  logger.debug('Trying to fetch public keys from ', url)
  return axios
    .get(url, {
      headers: { 'content-type': 'application/json' }
    })
    .then(response => {
      const keys = response.data
      logger.debug('Received keys', keys)
      logger.debug('All received keys count:', keys.keys.length)
      logger.debug('status', response.status, response.statusText)
      return keys.keys
    })
    .catch(error => {
      logger.warn('Could not fetch keys', error.data)
      return {
        status: 'error',
        details: 'Could not fetch keys due to ' + error.data
      }
    })
}

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
  maskNRIC,
  verifyPayload,
  fetchKeys
}
