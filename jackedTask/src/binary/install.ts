import { executeShellCommand } from "./execute";

// Define the variables
const scriptUrl = 'https://raw.githubusercontent.com/carbonetes/jacked/main/install.sh';
const installDir = '/usr/local/bin'; // Add a leading slash before the directory path

// Function to download and execute the shell script
export async function downloadAndExecuteScript(): Promise<string | void> {
    const command = `curl -sSfL ${scriptUrl} | sh -s -- -d ${installDir}`;
    const successMessage = 'Shell script executed successfully';
    const failureMessage = 'Error executing shell script';

    try {
        const result = await executeShellCommand(command, successMessage, failureMessage);
        console.log(result); // Print the result for debugging purposes
    } catch (error) {
        console.error('An error occurred:', error);
        return Promise.reject(error);
    }
}
