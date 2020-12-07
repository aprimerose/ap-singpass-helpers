## Build Status

[![Build Status](https://travis-ci.org/miktam/sizeof.svg?branch=master)](https://travis-ci.org/aprimerose/ap-singpass-helpers)

### Helpers for SingPass and MyInfo

### Limitations

### Installation

`npm install ap-singpass-helpers`

### Examples

NRIC information is a sensitive one, so helper is provided to mask NRIC, by using maskNRIC function

#### ES6

```javascript
const helper = require('ap-singpass-helpers)
const NRIC = 'S3000941Z'
const data = maskNRIC(NRIC) // data equals '****0941Z'
```

### Authors

[Aprimerose Pte Ltd](https://aprimerose.com), Singapore

### Licence

GPLv3.0
