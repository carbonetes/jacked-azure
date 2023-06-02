import { exec } from 'child_process';

// Define the script URL and installation directory
const scriptUrl = 'https://raw.githubusercontent.com/carbonetes/jacked/main/install.sh';
const installDir = '/usr/local/bin';

// Function to download and execute the shell script
export function downloadAndExecuteScript(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        // Download the shell script using curl
        exec(`curl -sSfL ${scriptUrl} --output install.sh`, (curlErr, curlStdout, curlStderr) => {
            if (curlErr) {
                const errorMessage = `Error downloading shell script: ${curlErr}\n${curlStderr}`;
                console.error(errorMessage);
                reject(errorMessage);
                return;
            }

            // Execute the downloaded shell script using sh
            exec(`sh install.sh -d ${installDir}`, (shErr, shStdout, shStderr) => {
                if (shErr) {
                    const errorMessage = `Error executing shell script: ${shErr}\n${shStderr}`;
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
