import { exec, ExecOptions } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { homedir } from 'os';
export function executeCommand(command: string, successMessage: string, failureMessage: string): void {
    const homeDir = homedir();
    const jackedBinaryPath = path.join(homeDir, 'jacked');

    // Check if the 'jacked' binary file exists
    if (!fs.existsSync(jackedBinaryPath) || !fs.lstatSync(jackedBinaryPath).isFile()) {
        console.error(`${failureMessage}: 'jacked' binary not found`);
        return;
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
        shell: '/bin/bash',
        maxBuffer: 250 * 1024 * 1024, // Set maxBuffer to 250MB
    };


    exec(`${jackedBinaryPath} ${command}`, execOptions, (error, stdout, stderr) => {
        if (error && error.code !== 0) {
            console.error(`${failureMessage}: ${error.message}`);
            return;
        }

        if (stderr) {
            console.error(`${failureMessage}: ${stderr}`);
            return;
        }

        console.log(stdout);
        console.log(successMessage);
    });
}