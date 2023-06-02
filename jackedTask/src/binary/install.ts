import { spawn } from 'child_process';

// Define the script URL and installation directory
const scriptUrl = 'https://raw.githubusercontent.com/carbonetes/jacked/main/install.sh';
const installDir = '/usr/local/bin';

// Function to download and execute the shell script
export function downloadAndExecuteScript(): Promise<void> {
    return new Promise((resolve, reject) => {
        const curlProcess = spawn('curl', ['-sSfL', scriptUrl]);

        curlProcess.on('close', (curlExitCode) => {
            if (curlExitCode === 0) {
                const installProcess = spawn('sh', ['-s', '--', '-d', installDir], {
                    stdio: 'inherit',
                });

                installProcess.on('close', (installExitCode) => {
                    if (installExitCode === 0) {
                        console.log('Shell script executed successfully');
                        resolve();
                    } else {
                        reject(new Error('Error executing shell script'));
                    }
                });
            } else {
                reject(new Error('Error downloading shell script'));
            }
        });
    });
}
