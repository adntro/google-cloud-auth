export interface CommandResult {
    out: string;
    err: string;
}
/**
 * Run command and retunrs the output
 * @param {string} cmd
 * @return {{ out: string, err: string}}
 */
export declare function runCommandSimple(cmd: string): Promise<CommandResult>;
