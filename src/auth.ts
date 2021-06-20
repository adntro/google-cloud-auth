import axios from 'axios';
import {runCommandSimple} from './cmd';

const getMetadataServerUrl = (resourceUrl: string) =>
  `http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=${resourceUrl}`;

export async function getIdTokenFromLocal(): Promise<string> {
  return (await runCommandSimple('gcloud auth print-identity-token')).out;
}

export function getIdTokenFromRemote(resourceUrl: string): Promise<string> {
  return axios
    .get(getMetadataServerUrl(resourceUrl), {
      headers: {'Metadata-Flavor': 'Google'},
    })
    .then(res => res.data)
    .catch(e => {
      throw new Error(
        `Cannot get idToken for resource. Response status: ${e.status}. Message: ${e.data}`
      );
    });
}

export async function getIdToken(resourceUrl: string): Promise<string> {
  try {
    return await getIdTokenFromLocal();
  } catch (e) {
    return await getIdTokenFromRemote(resourceUrl);
  }
}
