import { exec, ExecOptions } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export function executeCommand(command: string, successMessage: string, failureMessage: string): void {
    const jackedBinaryPath = path.join(__dirname, 'jacked'); // Assuming 'jacked' binary is in the same directory as this script

    // Check if the 'jacked' binary file exists
    if (!fs.existsSync(jackedBinaryPath) || !fs.lstatSync(jackedBinaryPath).isFile()) {
        console.error(`${failureMessage}: 'jacked' binary not found`);
        return;
    }

    const execOptions: ExecOptions = {
        shell: '/bin/bash',
    };

    exec(`${jackedBinaryPath} ${command}`, execOptions, (error, stdout, stderr) => {
        if (error) {
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
