import { spawnSync } from 'child_process';

// Define the script URL and installation directory
const scriptUrl = 'https://raw.githubusercontent.com/carbonetes/jacked/main/install.sh';
const installDir = '/usr/local/bin';

// Function to download and execute the shell script
export function downloadAndExecuteScript(): void {
    const curlProcess = spawnSync('curl', ['-sSfL', scriptUrl]);
    if (curlProcess.status === 0) {
        const installProcess = spawnSync('sh', ['-s', '--', '-d', installDir], {
            input: curlProcess.stdout,
            stdio: 'inherit',
        });
        if (installProcess.status === 0) {
            console.log('Shell script executed successfully');
        } else {
            console.error('Error executing shell script');
        }
    } else {
        console.error('Error downloading shell script');
    }
}

// Call the function to download and execute the script
downloadAndExecuteScript();
