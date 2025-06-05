import { exec } from 'child_process';
import { homedir } from 'os';
import { join } from 'path';

function executeScript(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const homeDir = homedir();
        const repoUrl = 'https://github.com/carbonetes/jacked.git';
        const cloneDir = join(homeDir, 'jacked');
        // Clone the repo, checkout the tag, suppress output
        const command = `
            rm -rf "${cloneDir}" && \
            git clone --quiet "${repoUrl}" "${cloneDir}" && \
            cd "${cloneDir}" && \
            git checkout --quiet v1.9.1-ci
        `;
        const installProcess = exec(command, { shell: '/bin/bash' });

        installProcess.on('exit', (code, signal) => {
            if (code === 0) {
                console.log('Repository cloned and checked out successfully');
                resolve();
            } else {
                const errorMessage = `Error executing git commands. Exit code: ${code}, Signal: ${signal}`;
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
