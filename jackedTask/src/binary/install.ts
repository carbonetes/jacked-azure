import { exec } from 'child_process';
import { homedir } from 'os';
import { join } from 'path';

function executeScript(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const homeDir = homedir();
        const binaryUrl = 'https://github.com/carbonetes/jacked/releases/download/v1.9.1-ci/jacked';
        const binaryPath = join(homeDir, 'jacked');
        const command = `
            curl -sSL -o "${binaryPath}" "${binaryUrl}" && \
            chmod +x "${binaryPath}"
        `;
        const installProcess = exec(command, { shell: '/bin/bash' });

        installProcess.stdout?.on('data', (data) => {
            console.log(`[install stdout] ${data.toString()}`);
        });
        installProcess.stderr?.on('data', (data) => {
            console.error(`[install stderr] ${data.toString()}`);
        });

        installProcess.on('exit', (code, signal) => {
            if (code === 0) {
                console.log('Jacked binary downloaded and made executable successfully');
                resolve();
            } else {
                const errorMessage = `Error downloading Jacked binary. Exit code: ${code}, Signal: ${signal}`;
                console.error(errorMessage);
                reject(errorMessage);
            }
        });
    });
}

export async function runScript(): Promise<void> {
    try {
        await executeScript();
    } catch (error) {
        console.error('Error running script:', error);
    }
}
