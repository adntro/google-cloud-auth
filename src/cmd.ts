import {exec} from 'child_process';

export interface CommandResult {
  out: string;
  err: string;
}

/**
 * Run command and retunrs the output
 * @param {string} cmd
 * @return {{ out: string, err: string}}
 */
export function runCommandSimple(cmd: string): Promise<CommandResult> {
  return new Promise((res, rej) => {
    exec(cmd, (error, out, err) => {
      if (error) {
        rej(error);
      }
      out = out.replace(/\r\n/g, '\n').replace(/\n$/g, '');
      err = err.replace(/\r\n/g, '\n').replace(/\n$/g, '');
      res({out, err});
    });
  });
}
