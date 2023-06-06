import { exec } from 'child_process';

function executeScript(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const command = 'curl -sSfL https://raw.githubusercontent.com/carbonetes/jacked/main/install.sh | sh -s -- -d .';
        const installProcess = exec(command);

        installProcess.stderr?.on('data', (data) => {
            console.error(data.toString());
        });

        installProcess.on('exit', (code) => {
            if (code === 0) {
                console.log('Script executed successfully');
                resolve();
            } else {
                const errorMessage = `Error executing script. Exit code: ${code}`;
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
