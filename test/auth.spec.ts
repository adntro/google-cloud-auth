import {
  getIdTokenFromLocal,
  getIdTokenFromRemote,
  getIdToken,
} from '../src/auth';
import * as assert from 'assert';
import * as sinon from 'sinon';
import * as cmd from '../src/cmd';

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const SAMPLE_TOKEN =
  'dsZS5jb20iLCJhenAiOiIzMjU1NTk0MDU1OS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjMyNTU1OTQwNTU5LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTAxNjY4MTkzODc1MjkyNzkyMTgyIiwiZW1haWwiOiJib21tb3hAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJlYmtYTDVpZlZnaDhUb0VhSXlyb2d3IiwiaWF0IjoxNjI0MTg3MzQwLCJleHAiOjE2MjQxOTA5NDB9.RFZOSxjJvpDEpCEpskbbzgp2UETLiQAisp-tkNrFTZuIMc5Qt7yhWQLKS70oqF30JOsF1ljDs5pviM6bGkpvtyqK13DjldnJcCbQAX0FWS3piLj1y2VaO7rlgYp';

const mock = new MockAdapter(axios);
let stub = sinon.stub(cmd, 'runCommandSimple');

describe('Google Cloud Auth', () => {
  describe('On local environment with credentials', () => {
    before(() => {
      try {
        stub = sinon.stub(cmd, 'runCommandSimple');
      } catch (e) {
        console.log('already stubbed');
      }
      stub.resolves({out: SAMPLE_TOKEN, err: ''});
    });
    after(() => {
      stub.restore();
    });
    it('Get idToken from local CLI', async () => {
      const token = await getIdTokenFromLocal();
      assert.strictEqual(token, SAMPLE_TOKEN);
      return;
    });
    it('Get idToken from auto environment', async () => {
      const token = await getIdToken('resource');
      assert.strictEqual(token, SAMPLE_TOKEN);
      return;
    });
  });
  describe('On local environment without credentials', () => {
    before(() => {
      try {
        stub = sinon.stub(cmd, 'runCommandSimple');
      } catch (e) {
        console.log('already stubbed');
      }
      stub.rejects('error');
    });
    after(() => {
      stub.restore();
    });
    it('Get idToken from local CLI', async () => {
      assert.rejects(() => getIdTokenFromLocal());
      return;
    });
    it('Get idToken from auto environment', async () => {
      assert.rejects(() => getIdToken('resource'));
      return;
    });
  });
  describe('On remote environment authenticated', () => {
    before(() => {
      try {
        stub = sinon.stub(cmd, 'runCommandSimple');
      } catch (e) {
        console.log('already stubbed');
      }
      stub.rejects('error');
      mock.onAny().reply(() => {
        return [200, SAMPLE_TOKEN];
      });
    });
    after(() => {
      stub.restore();
      mock.reset();
    });
    it('Get idToken from metadata server', async () => {
      const token = await getIdTokenFromRemote('myResource');
      assert.strictEqual(token.length > 100, true);
      return;
    });
    it('Get idToken from auto environment', async () => {
      const token = await getIdToken('resource');
      assert.strictEqual(token, SAMPLE_TOKEN);
      return;
    });
  });
  describe('On remote environment NOT authenticated', () => {
    before(() => {
      try {
        stub = sinon.stub(cmd, 'runCommandSimple');
      } catch (e) {
        console.log('already stubbed');
      }
      mock.onAny().reply(() => {
        return [400, 'Some error'];
      });
    });
    after(() => {
      stub.restore();
      mock.reset();
    });
    it('Get idToken from metadata server fails', async () => {
      await assert.rejects(() => getIdTokenFromRemote('myResource'));
      return;
    });
    it('Get idToken from auto environment', async () => {
      stub.restore();
      stub.rejects('error');
      assert.rejects(() => getIdToken('resource'));
      return;
    });
  });
});
