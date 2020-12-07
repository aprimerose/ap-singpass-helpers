## Build Status

[![Build Status](https://travis-ci.org/miktam/sizeof.svg?branch=master)](https://travis-ci.org/aprimerose/ap-singpass-helpers)

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

NRIC information is a sensitive one, so helper is provided to mask NRIC, by using maskNRIC function

#### ES6

```javascript
const helper = require('ap-singpass-helpers)
const NRIC = 'S3000941Z'
const data = helper.maskNRIC(NRIC) // data equals '****0941Z' now
```

### Authors

[Aprimerose Pte Ltd](https://aprimerose.com), Singapore

### Licence

GPLv3.0
