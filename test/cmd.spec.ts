import {runCommandSimple} from '../src/cmd';
import * as assert from 'assert';

describe('Cmd Util', () => {
  it('Exec echo hola', async () => {
    const res = await runCommandSimple('echo hola');
    assert.deepStrictEqual(res, {out: 'hola', err: ''});
    return;
  });
  it('Exec non existing command', async () => {
    await assert.rejects(async () =>
      runCommandSimple('thisdouesnotexists here')
    );
  });
});
