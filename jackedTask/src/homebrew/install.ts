import { spawn } from 'child_process';

export function installPackage(packageName: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const installProcess = spawn('apt', ['install', '-y', packageName]);

        installProcess.on('error', (err) => {
            const errorMessage = `Error installing package: ${err.message}`;
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
                const errorMessage = `Error installing package. Exit code: ${exitCode}`;
                console.error(errorMessage);
                reject(errorMessage);
            } else {
                console.log(`Package ${packageName} installed successfully`);
                resolve();
            }
        });
    });
}
