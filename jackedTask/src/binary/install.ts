import { exec } from 'child_process';

function executeScript(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const command = `bash -c "$(curl -sSfL https://raw.githubusercontent.com/carbonetes/jacked/main/install.sh | sh -s -- -v v1.9.1-ci -d)"`;
        const installProcess = exec(command, { shell: '/bin/bash' });

        installProcess.on('exit', (code, signal) => {
            if (code === 0) {
                console.log('Jacked installed successfully');
                resolve();
            } else {
                const errorMessage = `Error installing Jacked. Exit code: ${code}, Signal: ${signal}`;
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
