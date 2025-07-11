import { exec, ExecOptions } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { homedir } from 'os';
import { exit } from 'process';
import { constants } from '../../../constants/constants'

export function executeCommand(
    command: string,
    failureMessage: string,
    skipBuildFail: string
): void {
    const homeDir = homedir();

    const [binaryRelativePath, ...restArgs] = command.split(' ');

    if (!binaryRelativePath) {
        console.error(`${failureMessage} invalid binary path '${binaryRelativePath}'`);
        exit(1);
    }

    const binaryPath = path.isAbsolute(binaryRelativePath)
        ? binaryRelativePath
        : path.join(homeDir, binaryRelativePath);

    if (!fs.existsSync(binaryPath) || !fs.lstatSync(binaryPath).isFile()) {
        console.error(`${failureMessage} binary not found at ${binaryPath}`);
        exit(1);
    }

    const permissions = fs.statSync(binaryPath).mode;
    const isExecutable = (permissions & fs.constants.S_IXUSR) !== 0;

    if (!isExecutable) {
        fs.chmodSync(binaryPath, '755');
        console.log(`Executable permission set for binary at ${binaryPath}`);
    }

    const execOptions: ExecOptions = {
        cwd: '.',
        maxBuffer: 1024 * 1024 * 250,
        shell: '/bin/bash',
    };

    const fullCommand = [binaryPath, ...restArgs].join(' ');

    let hasFailure = false;

    const childProcess = exec(fullCommand, execOptions);

    childProcess.stdout?.on('data', (data) => {
        const log = data.toString().trim();
        console.log(log);
        if (log.includes(constants.CI_FAILURE)) {
            hasFailure = true;
        }
    });

    childProcess.stderr?.on('data', (data) => {
        const log = data.toString().trim();
        console.error(log);
        if (log.includes(constants.CI_FAILURE)) {
            hasFailure = true;
        }
    });

    childProcess.on('error', (error) => {
        console.error(`${failureMessage} Error running command: ${error.message}`);
        exit(1);
    });

    childProcess.on('exit', (code) => {
        let exitStatus = 0;

        if (hasFailure && skipBuildFail !== 'true') {
            exitStatus = 1;
        }

        exit(exitStatus);
    });

}
