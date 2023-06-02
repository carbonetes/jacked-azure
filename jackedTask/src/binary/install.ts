import { exec } from 'child_process';

// Define the script URL and installation directory
const scriptUrl = 'https://raw.githubusercontent.com/carbonetes/jacked/main/install.sh';
const installDir = '/usr/local/bin';

// Function to download and execute the shell script
export function downloadAndExecuteScript(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        // Download the shell script using curl
        exec(`curl -sSfL ${scriptUrl} --output install.sh`, (curlErr) => {
            if (curlErr) {
                console.error('Error downloading shell script:', curlErr);
                reject(curlErr);
                return;
            }

            // Execute the downloaded shell script using sh
            exec(`sh install.sh -d ${installDir}`, (shErr) => {
                if (shErr) {
                    console.error('Error executing shell script:', shErr);
                    reject(shErr);
                    return;
                }

                console.log('Shell script executed successfully');
                resolve();
            });
        });
    });
}
