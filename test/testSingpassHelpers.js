const path = require('path')
const {
  maskNRIC,
  verifyPayload,
  fetchKeys,
  createState,
  createNonce,
  getPubKeyFromPEM,
  loadPubKeyFromFile
} = require('../index')
const { ERROR_INCORRECT_URL } = require('../constants')
const { logger } = require('../logger')

/* global describe, it */

require('should')

describe('SingPass helpers', () => {
  const singPassProvidedInfo = {
    access_token: 'hYOEQifBUsrbVGLXY6sDvE5o6c98EJQK2Ofk7ibD',
    refresh_token: 'X3iqA7jk8GMVGXXc6cFjMrD0HLqToOeKK0AaoFuf',
    scope: 'openid uinfin',
    id_token:
      'eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoibWZpRThvWUhGVlg4V1VWYWtHRERLUXBta1VsZjM5c19ZUG1rRmp3LUVCQSIsImN0eSI6IkpXVCJ9.iqrZTjgolv0ZJRS3Yz9UIdjy2e8D0QR_WaNWfafuMOwN_OC7Ql3LG81vpJw8dyhqW30hGpEiXHm5is_f-3z5Nm6v2jy3ARofTVG6bh2b6_wkY_dwlt_S0Az0N9B82br9OPUakNYlEGHPR-A6kcM_xfP4v5WnCwwmGNWXIQrE6tI6NDRU2-HsynSYn-UDQk5PemUiA67-DSZIMPNkI23_coNh-owalgeMOUAzmUkZOVW-Uaqvoe5J06bgRDw7YPVA3G0cjXlg0phe-euV3cHAT60c5aQOt9uNSUszayYvU7wrhCkhvEb8FCsx1AnwAAyChoTxySMnOqMFwVF_L_uGYw.eMpBQKDTGu1B5bnj7G2MAg._2szkCeuQa-2aKfnILH59svi8IiQDSZelBn_NTV2__6dVJz_wOYaBDwUHsSyCOlvzKMp-HzluMI1Q6Q9swKqqvaQlKqDePz2Fs2DfzwxjpoMxwPBb416T_ooMYJa0isANP6kXypS4efjyrxDeKztZlnKcVvs6MX27Kc2a2OUs5QajbZPu-oBSm4uyqiH7iuQQpgpAmgHV-lUCGqOMoo8qIVK34PXXctbEKebZ_PDpf0I9ypZf3V7MKL7CsmjEDTacJtvJshLJvN6HBCRg8qrhxjkgZyLADooiQa_BJJI91DEU0Luc-KzkdAP0FYvo3o3SLF5dfXnqHTQsAAcGZYsRdaXphUU4iQX0wO5cJXaUX0qNLaPzFghlhGxolr4strAaZ4fXgO4RHMdcgQdpBq_rsdoaTY6DahqMLq96ennQNGjSuG2k26oeZvAk20r73CJrDEvhhkZ1X-MdgRG95PmNEr33YgeBSRPCxvfAl_dEr5sKBJSu_xOSDUX6dHayat0Jue0BxXTzpbZhWTM-krgXYFEFAnP0ARw_s8DwSo-ksseBnLnaZj0_XA1-YTK6ugaBp1GDWkearsdh2QOUN9bw27Rx2lOyRBzInpU_Pwhlqhm7MVtPG7iCuAj-ejxqjxxYoXW5GMmd6qBc45i_o5_8s2fUMob-5fKy_8HI4WBmjl2Xg7Ij9FxL_JDvchkh_ja9EO6LDHhmMnMdQMbFVYHRJ_PtHZn93mIN3ltOW0y8rgloaZCozFyaSHzj0m11bQFyBHa9fgWCVbEVyG1DHZxdq01UdQ9Fyy9GDZ6iE38WBTSLlP0Vo4nWIgU9G2SkFpP0-xuOfVobwDqsUWVZugK037LhiwI9bv5DCcpLxXO-XPiFPZHpqELshB6k6qdL3dk7udkq_unpR3uod48HR48Xa56f5KSaIBXVN4wu6BqV1neD-PCG2_tqn9UcvXJLdbUUHXbuG8s0Rxs9t438hj4DpTMTudvQ_eqI-VDZECyfXiUW7ESy0dhZjJxfCgSrS-vYxG7CQ5N9Kdlp6L4u-uv8g.y9_GrlLgVAtmZXXI27R0aTpEhjm-2luJPCMhlIpkKK4',
    token_type: 'bearer',
    expires_in: 599
  }

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

  // works only in whitelisted env
  it.skip('verify payload - should fail with the wrong input', async () => {
    const URL =
      'https://stg-saml-internet.singpass.gov.sg/mga/sps/oauth/oauth20/jwks/SingPassOP'
    const KEY_ID = 'rnpBA3SUQ6TEkMaVX83IV40S9Fp6yxX-F83phMO85qI'
    const payload = await verifyPayload(
      singPassProvidedInfo.id_token,
      URL,
      KEY_ID
    )
    payload.should.be.instanceOf(Error)
    payload.message.should.equal('Could not verify a payload')
  })

  it('fetch public keys - should fail as URL is wrong', async () => {
    return fetchKeys('wrong url').catch(err => {
      err.should.be.instanceOf(Error)
      err.message.should.equal(ERROR_INCORRECT_URL)
    })
  })

  it('fetch public keys', async () => {
    return fetchKeys('https://stg-id.singpass.gov.sg/.well-known/keys').then(
      keys => keys.should.be.instanceOf(Array)
    )
  })

  it('create and test nonce', () => {
    const nonce = createNonce()
    nonce.should.not.equal(null)
  })

  it('create and test state', () => {
    const state = createState()
    state.should.not.equal(null)
  })

  it('get JWK key', async () => {
    const pubKey = `-----BEGIN PUBLIC KEY-----
    MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE1xc5NSTs3KLltnTtuyiHYI+HeFjQ
    SQh+4MWQvpenh1LrxQ/uvUXO0auGSp0GR5cyQLRh66HFzof3ZFV3rk4UzA==
    -----END PUBLIC KEY-----`
    logger.debug('get pem and return jwk key')
    const res = await getPubKeyFromPEM(pubKey)
    logger.info('Pub key', res)
  })

  it('Load JWKS key from file', async () => {
    const fileLocation = path.join(__dirname, '/keys/jkws_keys.json')
    logger.debug('File with JSON is here:', fileLocation)
    const res = await loadPubKeyFromFile(fileLocation)
    logger.info('Result', res)
    res.keystore.should.not.equal(null)
  })
})
