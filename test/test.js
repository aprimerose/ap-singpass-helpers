const { maskNRIC } = require('../index')

/* global describe, it */

require('should')

describe('SingPass helpers', () => {
  it('mask NRIC number leaving only last 5 characters', () => {
    const NRIC = 'S3000941Z'
    const data = maskNRIC(NRIC)
    data.should.equal('****0941Z')
  })

  it('handle NRIC masking when NRIC is null', () => {
    const NRIC = null
    const data = maskNRIC(NRIC)
    data.should.equal('XXXXXXXNRC')
  })

  it('handle NRIC masking when NRIC is too long', () => {
    const NRIC = 'S3000941Z' + 'S3000941Z'
    const data = maskNRIC(NRIC)
    data.should.equal('****0941Z')
  })
})
