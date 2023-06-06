import { spawn } from 'child_process';

export function tapRepository(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const tapProcess = spawn('brew', ['tap', 'carbonetes/jacked']);

        tapProcess.on('error', (err) => {
            const errorMessage = `Error tapping repository: ${err.message}`;
            console.error(errorMessage);
            reject(errorMessage);
        });

        tapProcess.stdout.on('data', (data) => {
            console.log(data.toString());
        });

        tapProcess.stderr.on('data', (data) => {
            console.error(data.toString());
        });

        tapProcess.on('close', (exitCode) => {
            if (exitCode !== 0) {
                const errorMessage = `Error tapping repository. Exit code: ${exitCode}`;
                console.error(errorMessage);
                reject(errorMessage);
            } else {
                console.log('Repository tapped successfully');
                resolve();
            }
        });
    });
}

export function installJacked(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const installProcess = spawn('brew', ['install', 'jacked']);

        installProcess.on('error', (err) => {
            const errorMessage = `Error installing jacked package: ${err.message}`;
            console.error(errorMessage);
            reject(errorMessage);
        });

        installProcess.stdout.on('data', (data) => {
            console.log(data.toString());
        });

        installProcess.stderr.on('data', (data) => {
            console.error(data.toString());
        });

        installProcess.on('close', (exitCode) => {
            if (exitCode !== 0) {
                const errorMessage = `Error installing jacked package. Exit code: ${exitCode}`;
                console.error(errorMessage);
                reject(errorMessage);
            } else {
                console.log('jacked package installed successfully');
                resolve();
            }
        });
    });
}
