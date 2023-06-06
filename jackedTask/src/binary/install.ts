import { spawn } from 'child_process';

// Define the script URL and installation directory
const scriptUrl = 'https://raw.githubusercontent.com/carbonetes/jacked/main/install.sh';
const installDir = '/usr/local/bin';

// Function to download and execute the shell script
export function downloadAndExecuteScript(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        // Download the shell script using curl
        const curlProcess = spawn('curl', ['-sSfL', scriptUrl]);

        // Error handling for the curl process
        curlProcess.on('error', (err) => {
            const errorMessage = `Error downloading shell script: ${err.message}`;
            console.error(errorMessage);
            reject(errorMessage);
        });

        // Capture and print the output of curl
        let curlOutput = '';
        curlProcess.stdout.on('data', (data) => {
            const output = data.toString();
            curlOutput += output;
            console.log(output);
        });

        curlProcess.stderr.on('data', (data) => {
            const output = data.toString();
            curlOutput += output;
            console.error(output);
        });

        // Handling the close event of the curl process
        curlProcess.on('close', (curlExitCode) => {
            if (curlExitCode !== 0) {
                const errorMessage = `Error downloading shell script. Exit code: ${curlExitCode}`;
                console.error(errorMessage);
                reject(errorMessage);
                return;
            }

            // Execute the downloaded shell script using sh
            const installProcess = spawn('sh', ['-s', '--', '-d', installDir]);

            // Error handling for the install process
            installProcess.on('error', (err) => {
                const errorMessage = `Error executing shell script: ${err.message}`;
                console.error(errorMessage);
                reject(errorMessage);
            });

            // Capture and print the output of install
            let installOutput = '';
            installProcess.stdout.on('data', (data) => {
                const output = data.toString();
                installOutput += output;
                console.log(output);
            });

            installProcess.stderr.on('data', (data) => {
                const output = data.toString();
                installOutput += output;
                console.error(output);
            });

            // Handling the close event of the install process
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
