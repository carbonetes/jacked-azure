import { exec } from 'child_process';

function executeScript(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const command = 'curl -sSfL https://raw.githubusercontent.com/carbonetes/jacked/main/install.sh | sh -s -- -d .';
        const installProcess = exec(command);

        installProcess.stderr?.on('data', (data) => {
            console.error(data.toString());
        });

        installProcess.on('exit', (code, signal) => {
            if (code === 0) {
                console.log('Script executed successfully');
                if (installProcess.stdout) {
                    console.log('Script output:', installProcess.stdout.toString());
                }
                resolve();
            } else {
                const errorMessage = `Error executing script. Exit code: ${code}, Signal: ${signal}`;
                console.error(errorMessage);
                if (installProcess.stdout) {
                    console.log('Script output:', installProcess.stdout.toString());
                }
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
