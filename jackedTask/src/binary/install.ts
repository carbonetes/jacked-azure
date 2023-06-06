import { exec } from 'child_process';
import { homedir } from 'os';

function executeScript(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const homeDir = homedir();
        const command = `curl -sSfL https://raw.githubusercontent.com/carbonetes/jacked/main/install.sh | sh -s -- -d ${homeDir} > /dev/null 2>&1`;
        const installProcess = exec(command);

        installProcess.on('exit', (code, signal) => {
            if (code === 0) {
                console.log('Script executed successfully');
                resolve();
            } else {
                const errorMessage = `Error executing script. Exit code: ${code}, Signal: ${signal}`;
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
