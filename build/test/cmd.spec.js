"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cmd_1 = require("../src/cmd");
const assert = require("assert");
describe('Cmd Util', () => {
    it('Exec echo hola', async () => {
        const res = await cmd_1.runCommandSimple('echo hola');
        assert.deepStrictEqual(res, { out: 'hola', err: '' });
        return;
    });
    it('Exec non existing command', async () => {
        await assert.rejects(async () => cmd_1.runCommandSimple('thisdouesnotexists here'));
    });
});
//# sourceMappingURL=cmd.spec.js.map