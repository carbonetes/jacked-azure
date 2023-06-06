import { spawn } from 'child_process';

export function installHomebrew(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        // Check if Homebrew is already installed
        const brewProcess = spawn('brew', ['--version']);

        brewProcess.on('error', (err) => {
            // Homebrew is not installed, proceed with installation
            const installProcess = spawn('/bin/bash', ['-c', "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"]);

            installProcess.on('error', (err) => {
                const errorMessage = `Error executing Homebrew installation: ${err.message}`;
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
                    const errorMessage = `Error installing Homebrew. Exit code: ${exitCode}`;
                    console.error(errorMessage);
                    reject(errorMessage);
                } else {
                    console.log('Homebrew installed successfully');
                    resolve();
                }
            });
        });

        brewProcess.on('close', (exitCode) => {
            if (exitCode === 0) {
                console.log('Homebrew is already installed');
                resolve();
            } else {
                const errorMessage = `Error checking Homebrew installation. Exit code: ${exitCode}`;
                console.error(errorMessage);
                reject(errorMessage);
            }
        });
    });
}
