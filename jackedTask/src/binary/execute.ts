import { exec } from 'child_process';

// Function to execute the 'jacked' command
export function executeCommand(command: string, successMessage: string, failureMessage: string): void {
    exec(`${command}`, { cwd: __dirname }, (error, stdout, stderr) => {
        if (error) {
            console.error(`${failureMessage}: ${stderr}`);
        } else {
            console.log(stdout);
            console.log(successMessage);
        }
    });
}
