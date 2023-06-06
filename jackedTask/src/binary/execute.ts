import { exec, ExecOptions } from 'child_process';

export function executeCommand(command: string, successMessage: string, failureMessage: string): void {
    const execOptions: ExecOptions = {
        shell: '/bin/bash',
    };

    exec(command, execOptions, (error, stdout, stderr) => {
        if (error) {
            console.error(`${failureMessage}: ${error.message}`);
            return;
        }

        if (stderr) {
            console.error(`${failureMessage}: ${stderr}`);
            return;
        }

        console.log(stdout);
        console.log(successMessage);
    });
}