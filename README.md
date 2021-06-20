# @adntro/google-cloud-auth
> Google Cloud auth utilitities (get token from functions, local, etc.)

[![npm version](https://img.shields.io/npm/v/axios.svg?style=flat-square)](https://www.npmjs.com/package/@adntro/google-cloud-auth)

It makes easy to get a bearer token to use from local to invoked authorized endpoints (Cloud Functions, Cloud Run, etc.), and also 
to get that token to invoke a secured resource from another resorce.

## Getting started

Install as a dependency

```
npm i -S @adntro/google-cloud-auth
```

- In **local environment** you must have installed `gcloud sdk` (https://cloud.google.com/sdk/docs/install)
- From a function, the service account which executes the code should have permission to invoke the remote function

## Usage

```
const { getIdToken } = require('@adntro/google-cloud-auth');

async function invokeEndpoint(url, data) {
    const token = await getIdToken(url);
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token  // <-- The idToken
        }
    });
}
```


## License
[MIT](LICENSE)

---
Made with ❤️ by the Adntro Genetics Developer Team.
> ***NOTE: This is not an official Adntro product.***
