import { exec, ExecOptions } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { homedir } from 'os';
export function executeCommand(command: string, failedSeverity: string, failureMessage: string): void {
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
            console.error(`Error running 'jacked' command: ${error.message}`);
            process.exit(1); // Exit the process with a non-zero status code to indicate failure
        }

        const logBuffer = [];

        // Capture stdout and stderr in a log buffer
        if (stdout) {
            logBuffer.push(stdout);
        }

        if (stderr) {
            logBuffer.push(stderr);
        }

        // Filter and trim the logs
        const logs = logBuffer.join('').split('\n')
            .filter((log) => !log.includes('Extracting files'))
            .filter((log) => !log.includes('Downloading updated database'))
            .map((log) => log.trim())
            .filter((log) => log !== '');

        // Print the logs in the correct order
        let failed = false;
        for (const log of logs) {
            console.log(log);
            if (log.includes('Failed:')) {
                failed = true;
            }
        }

        if (failed) {
            console.error(`Jacked assesstment failed: Vulnerabilities found equal or higher than ${failedSeverity}`);
            process.exit(1); // Exit the process with a non-zero status code to indicate failure
        }

    });

}