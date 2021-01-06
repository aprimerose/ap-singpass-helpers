## Build Status

[![Build Status](https://travis-ci.org/miktam/sizeof.svg?branch=master)](https://travis-ci.org/aprimerose/ap-singpass-helpers)
[![codecov](https://codecov.io/gh/aprimerose/ap-singpass-helpers/branch/master/graph/badge.svg?token=K1BXXRWN4I)](https://codecov.io/gh/aprimerose/ap-singpass-helpers)

### Helpers for SingPass and MyInfo

Digital ID and e-KYC are greatly simplified by using [SingPass and MyInfo](https://www.mas.gov.sg/development/fintech/technologies---digital-id-and-e-kyc), allowing such use cases as:

- On-boarding of new customers
- Authentication of customers
- Digital authorisations and signatures

This set of tools is prepared to integrate SingPass easier.

### Limitations

SingPass application works only for Singaporean citizens and PR.

### Installation

`npm install ap-singpass-helpers`

### Examples

Payload receied from SingPass BO server could be verified using _verifyPayload_ method
NRIC information is a sensitive one, so helper is provided to mask NRIC, by using _maskNRIC_ function

#### ES6

```javascript
const singpassHelper = require('ap-singpass-helpers)

// creates nonce, max 255 characters, alphanumeric
const nonce = singpassHelper.createNonce()

// creates state, max 255 characters, base64 encoded
const state = singpassHelper.createState()

const payload = await singpassHelper.verifyPayload('payload to verify', 'validUrlToFetchJWKS keys from', 'validPubKeyId') // return verified payload

const NRIC = 'S3000941Z'
const data = singpassHelper.maskNRIC(NRIC) // data equals '****0941Z' now
```

### Authors

[Aprimerose Pte Ltd](https://aprimerose.com), Singapore

### Licence

GPLv3.0
