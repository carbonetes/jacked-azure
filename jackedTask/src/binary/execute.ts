import { spawnSync } from 'child_process';

// Function to execute the 'jacked' command
export function executeJackedCommand(command: string, successMessage: string, failureMessage: string): void {
    const jackedProcess = spawnSync(command);
    if (jackedProcess.status === 0) {
        console.log(successMessage);
    } else {
        console.error(failureMessage);
    }
}
