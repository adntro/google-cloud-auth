"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../src/auth");
const assert = require("assert");
const sinon = require("sinon");
const cmd = require("../src/cmd");
const axios_1 = require("axios");
const axios_mock_adapter_1 = require("axios-mock-adapter");
const SAMPLE_TOKEN = 'dsZS5jb20iLCJhenAiOiIzMjU1NTk0MDU1OS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjMyNTU1OTQwNTU5LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTAxNjY4MTkzODc1MjkyNzkyMTgyIiwiZW1haWwiOiJib21tb3hAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJlYmtYTDVpZlZnaDhUb0VhSXlyb2d3IiwiaWF0IjoxNjI0MTg3MzQwLCJleHAiOjE2MjQxOTA5NDB9.RFZOSxjJvpDEpCEpskbbzgp2UETLiQAisp-tkNrFTZuIMc5Qt7yhWQLKS70oqF30JOsF1ljDs5pviM6bGkpvtyqK13DjldnJcCbQAX0FWS3piLj1y2VaO7rlgYp';
const mock = new axios_mock_adapter_1.default(axios_1.default);
let stub = sinon.stub(cmd, 'runCommandSimple');
describe('Google Cloud Auth', () => {
    describe('On local environment with credentials', () => {
        before(() => {
            try {
                stub = sinon.stub(cmd, 'runCommandSimple');
            }
            catch (e) {
                console.log('already stubbed');
            }
            stub.resolves({ out: SAMPLE_TOKEN, err: '' });
        });
        after(() => {
            stub.restore();
        });
        it('Get idToken from local CLI', async () => {
            const token = await auth_1.getIdTokenFromLocal();
            assert.strictEqual(token, SAMPLE_TOKEN);
            return;
        });
        it('Get idToken from auto environment', async () => {
            const token = await auth_1.getIdToken('resource');
            assert.strictEqual(token, SAMPLE_TOKEN);
            return;
        });
    });
    describe('On local environment without credentials', () => {
        before(() => {
            try {
                stub = sinon.stub(cmd, 'runCommandSimple');
            }
            catch (e) {
                console.log('already stubbed');
            }
            stub.rejects('error');
        });
        after(() => {
            stub.restore();
        });
        it('Get idToken from local CLI', async () => {
            assert.rejects(() => auth_1.getIdTokenFromLocal());
            return;
        });
        it('Get idToken from auto environment', async () => {
            assert.rejects(() => auth_1.getIdToken('resource'));
            return;
        });
    });
    describe('On remote environment authenticated', () => {
        before(() => {
            try {
                stub = sinon.stub(cmd, 'runCommandSimple');
            }
            catch (e) {
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
            const token = await auth_1.getIdTokenFromRemote('myResource');
            assert.strictEqual(token.length > 100, true);
            return;
        });
        it('Get idToken from auto environment', async () => {
            const token = await auth_1.getIdToken('resource');
            assert.strictEqual(token, SAMPLE_TOKEN);
            return;
        });
    });
    describe('On remote environment NOT authenticated', () => {
        before(() => {
            try {
                stub = sinon.stub(cmd, 'runCommandSimple');
            }
            catch (e) {
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
            await assert.rejects(() => auth_1.getIdTokenFromRemote('myResource'));
            return;
        });
        it('Get idToken from auto environment', async () => {
            stub.restore();
            stub.rejects('error');
            assert.rejects(() => auth_1.getIdToken('resource'));
            return;
        });
    });
});
//# sourceMappingURL=auth.spec.js.map