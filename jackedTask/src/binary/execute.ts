import { exec, ExecOptions } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { homedir } from 'os';
import { exit } from 'process';
import { Styles, Common, Strings } from '../../styles'
import { skip } from 'node:test';

export function executeCommand(
    command: string,
    failedSeverity: string,
    failureMessage: string,
    skipFail: boolean
): void {
    const homeDir = homedir();
    const jackedBinaryPath = path.join(homeDir, 'jacked');

    // Check if the 'jacked' binary file exists
    if (!fs.existsSync(jackedBinaryPath) || !fs.lstatSync(jackedBinaryPath).isFile()) {
        console.error(`${failureMessage}: 'jacked' binary not found`);
        exit(1);
    }

    // Check the permissions of the 'jacked' binary
    const permissions = fs.statSync(jackedBinaryPath).mode;
    const isExecutable = (permissions & fs.constants.S_IXUSR) !== 0;

    // Set executable permission if necessary
    if (!isExecutable) {
        fs.chmodSync(jackedBinaryPath, '755');
        console.log(`Executable permission set for 'jacked' binary`);
    }

    const execOptions: ExecOptions = {
        cwd: '.',
        maxBuffer: 1024 * 1024 * 250, // Set a higher value for maxBuffer (e.g., 250MB)
        shell: '/bin/bash',
    };

    const childProcess = exec(`${jackedBinaryPath} ${command}`, execOptions);
    childProcess.stdout?.on('data', (data) => {
        const log = data.toString().trim();
        console.log(log);
    });

    childProcess.stderr?.on('data', (data) => {
        // Ignore stderr output
    });

    childProcess.on('error', (error) => {
        console.error(`Error running 'jacked' command: ${error.message}`);
        exit(1);
    });

    childProcess.on('exit', (code) => {
        // Skip fail is true, exit 0
        if (code === 0) {

            console.error(
                Common.success + '\n' +
                Strings.JACKEDASSESSMENT +
                Strings.PASSED +
                Styles.FgGreen +
                Styles.Bold  
            );
            exit(0);
        } else {
            console.error(
                Common.error + '\n' +
                Strings.JACKEDASSESSMENT +
                Strings.FAILED +
                Styles.FgRed +
                Styles.Bold 
            );
            if (!skipFail) {
                exit(1);
            } else {
                exit(0);
            }
        }
    });
}
