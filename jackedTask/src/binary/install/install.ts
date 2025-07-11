import { exec } from 'child_process';
import { homedir } from 'os';
import * as path from 'path';
import { constants  } from '../../../constants/constants';

function executeScript(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const installDir = homedir();
        const binaryPath = path.join(installDir, 'carbonetes-ci');
        const command = `curl -sSfL https://raw.githubusercontent.com/carbonetes/ci/main/install.sh | bash -s -- -d "${installDir}" && chmod +x "${binaryPath}"`;

        console.log(`Installing binary to: ${binaryPath}`);

        const installProcess = exec(command, { shell: '/bin/bash' });

        installProcess.stdout?.on('data', (data) => {
            // console.log(`[install stdout] ${data.toString()}`);
        });
        installProcess.stderr?.on('data', (data) => {
            // console.error(`[install stderr] ${data.toString()}`);
        });

        installProcess.on('exit', (code, signal) => {
            if (code === 0) {
                console.log(`Binary installed successfully to: ${binaryPath}`);
                resolve(binaryPath);
            } else {
                const errorMessage = `${constants.CI_FAILURE} Error installing binary. Exit code: ${code}, Signal: ${signal}`;
                console.error(errorMessage);
                reject(errorMessage);
            }
        });
    });
}

export async function runScript(): Promise<string | undefined> {
    try {
        return await executeScript();
    } catch (error) {
        console.error('Error running script:', error);
        return undefined;
    }
}