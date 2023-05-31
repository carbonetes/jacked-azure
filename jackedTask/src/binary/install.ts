import { executeShellCommand } from "./execute";

// Define the variables
const scriptUrl = 'https://raw.githubusercontent.com/carbonetes/jacked/main/install.sh';
const installDir = '/usr/local/bin';

// Function to download and execute the shell script
export async function downloadAndExecuteScript(): Promise<void> {
    const command = `curl -sSfL ${scriptUrl} | sh -s -- -d ${installDir}`;
    const successMessage = 'Shell script executed successfully';
    const failureMessage = 'Error executing shell script';

    try {
        await executeShellCommand(command, successMessage, failureMessage);
    } catch (error) {
        return Promise.reject(error);
    }
}
