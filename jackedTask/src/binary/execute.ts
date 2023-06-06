import { spawnSync, SpawnSyncReturns } from 'child_process';

// Function to execute the 'jacked' command
export function executeJackedCommand(command: string, successMessage: string, failureMessage: string): void {
    const jackedProcess = spawnSync('command', ['-v', 'jacked']);

    if ((jackedProcess as SpawnSyncReturns<Buffer>).status === 0) {
        const output = (jackedProcess.stdout as Buffer).toString().trim();
        console.log(successMessage);
        console.log(`'jacked' command is available at ${output}`);
    } else {
        console.error(`${failureMessage}: 'jacked' command not found`);
    }
}
