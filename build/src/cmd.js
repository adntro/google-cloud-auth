"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCommandSimple = void 0;
const child_process_1 = require("child_process");
/**
 * Run command and retunrs the output
 * @param {string} cmd
 * @return {{ out: string, err: string}}
 */
function runCommandSimple(cmd) {
    return new Promise((res, rej) => {
        child_process_1.exec(cmd, (error, out, err) => {
            if (error) {
                rej(error);
            }
            out = out.replace(/\r\n/g, '\n').replace(/\n$/g, '');
            err = err.replace(/\r\n/g, '\n').replace(/\n$/g, '');
            res({ out, err });
        });
    });
}
exports.runCommandSimple = runCommandSimple;
//# sourceMappingURL=cmd.js.map