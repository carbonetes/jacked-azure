import { spawn } from 'child_process';

// Define the script URL and installation directory
const scriptUrl = 'https://raw.githubusercontent.com/carbonetes/jacked/main/install.sh';
const installDir = '/usr/local/bin';

// Function to download and execute the shell script
export function downloadAndExecuteScript(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        // Download the shell script using curl
        const curlProcess = spawn('curl', ['-sSfL', scriptUrl]);

        curlProcess.on('error', (err) => {
            const errorMessage = `Error downloading shell script: ${err.message}`;
            console.error(errorMessage);
            reject(errorMessage);
        });

        curlProcess.stdout.on('data', (data) => {
            // Ignore data from stdout
        });

        curlProcess.on('close', (curlExitCode) => {
            if (curlExitCode !== 0) {
                const errorMessage = `Error downloading shell script. Exit code: ${curlExitCode}`;
                console.error(errorMessage);
                reject(errorMessage);
                return;
            }

            // Execute the downloaded shell script using sh
            const installProcess = spawn('sh', ['-s', '--', '-d', installDir]);

            installProcess.on('error', (err) => {
                const errorMessage = `Error executing shell script: ${err.message}`;
                console.error(errorMessage);
                reject(errorMessage);
            });

            installProcess.stdout.on('data', (data) => {
                console.log(data.toString());
            });

            installProcess.stderr.on('data', (data) => {
                console.error(data.toString());
            });

            installProcess.on('close', (installExitCode) => {
                if (installExitCode !== 0) {
                    const errorMessage = `Error executing shell script. Exit code: ${installExitCode}`;
                    console.error(errorMessage);
                    reject(errorMessage);
                    return;
                }

                console.log('Shell script executed successfully');
                resolve();
            });
        });
    });
}
