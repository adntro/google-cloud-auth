"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIdToken = exports.getIdTokenFromRemote = exports.getIdTokenFromLocal = void 0;
const axios_1 = require("axios");
const cmd_1 = require("./cmd");
const getMetadataServerUrl = (resourceUrl) => `http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=${resourceUrl}`;
async function getIdTokenFromLocal() {
    return (await cmd_1.runCommandSimple('gcloud auth print-identity-token')).out;
}
exports.getIdTokenFromLocal = getIdTokenFromLocal;
function getIdTokenFromRemote(resourceUrl) {
    return axios_1.default
        .get(getMetadataServerUrl(resourceUrl), {
        headers: { 'Metadata-Flavor': 'Google' },
    })
        .then(res => res.data)
        .catch(e => {
        throw new Error(`Cannot get idToken for resource. Response status: ${e.status}. Message: ${e.data}`);
    });
}
exports.getIdTokenFromRemote = getIdTokenFromRemote;
async function getIdToken(resourceUrl) {
    try {
        return await getIdTokenFromLocal();
    }
    catch (e) {
        return await getIdTokenFromRemote(resourceUrl);
    }
}
exports.getIdToken = getIdToken;
//# sourceMappingURL=auth.js.map