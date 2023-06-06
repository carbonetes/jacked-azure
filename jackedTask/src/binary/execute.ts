import { spawnSync } from 'child_process';

// Function to execute the 'jacked' command
export function executeJackedCommand(command: string, successMessage: string, failureMessage: string): void {
    const jackedProcess = spawnSync(command, { shell: true });

    if (jackedProcess.status === 0) {
        console.log(jackedProcess.stdout.toString());
        console.log(successMessage);
    } else {
        console.error(`${failureMessage}: ${jackedProcess.stderr}`);
    }
}

