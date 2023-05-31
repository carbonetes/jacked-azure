import { exec } from 'child_process';

// Function to execute a shell command
export function executeShellCommand(command: string, successMessage: string, failureMessage: string): Promise<void> {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                const errorMessage = `${failureMessage}: ${error.message}`;
                reject(errorMessage);
                return;
            }
            if (stderr) {
                const errorMessage = `${failureMessage} error: ${stderr}`;
                reject(errorMessage);
                return;
            }
            console.log(`${successMessage}:\n${stdout}`);
            resolve();
        });
    });
}
