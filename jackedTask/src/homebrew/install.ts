import { exec } from 'child_process';

export function installHomebrew(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const installCommand = 'sh -c "$(curl -fsSL https://raw.githubusercontent.com/Linuxbrew/install/master/install.sh)"';

        const installProcess = exec(installCommand);

        installProcess.stderr?.on('data', (data) => {
            console.error(data.toString());
        });

        installProcess.on('exit', (code) => {
            if (code === 0) {
                console.log('Homebrew installed successfully');
                resolve();
            } else {
                const errorMessage = `Error installing Homebrew. Exit code: ${code}`;
                console.error(errorMessage);
                reject(errorMessage);
            }
        });
    });
}

installHomebrew().catch((error) => {
    console.error('Error installing Homebrew:', error);
});
