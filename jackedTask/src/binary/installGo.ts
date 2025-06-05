import { exec } from 'child_process';
import { homedir } from 'os';
import { join } from 'path';

function executeScriptGo(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const homeDir = homedir();
        const goUrl = 'https://go.dev/dl/go1.22.4.linux-amd64.tar.gz';
        const goDir = join(homeDir, 'go');
        const command = `
            rm -rf "${goDir}" && \
            mkdir -p "${goDir}" && \
            wget -qO- "${goUrl}" | tar -xz -C "${goDir}" --strip-components=1
        `;
        const installProcess = exec(command, { shell: '/bin/bash' });

        installProcess.on('exit', (code, signal) => {
            if (code === 0) {
                console.log('Go downloaded and extracted successfully');
                resolve();
            } else {
                const errorMessage = `Error installing Go. Exit code: ${code}, Signal: ${signal}`;
                console.error(errorMessage);
                reject(errorMessage);
            }
        });
    });
}

export async function runScriptGo(): Promise<void> {
    try {
        await executeScriptGo();
    } catch (error) {
        console.error('Error running script:', error);
    }
}
