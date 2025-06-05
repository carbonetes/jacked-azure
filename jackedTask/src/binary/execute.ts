import { exec, ExecOptions } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { homedir } from 'os';
import { exit } from 'process';
import { Styles, Common, Strings } from '../../styles'

export function executeCommand(
    command: string,
    failedSeverity: string,
    failureMessage: string,
    skipBuildFail: string
): void {
    const homeDir = homedir();

    // Extract the binary path (first word in command)
    const [binaryRelativePath, ...restArgs] = command.split(' ');

    // Check for invalid binary path (e.g., starts with a dash)
    if (!binaryRelativePath || binaryRelativePath.startsWith('-')) {
        console.error(`${failureMessage}: invalid binary path '${binaryRelativePath}'`);
        exit(1);
    }

    // Support absolute or relative binary path
    const binaryPath = path.isAbsolute(binaryRelativePath)
        ? binaryRelativePath
        : path.join(homeDir, binaryRelativePath);

    // Check if the binary file exists
    if (!fs.existsSync(binaryPath) || !fs.lstatSync(binaryPath).isFile()) {
        console.error(`${failureMessage}: binary not found at ${binaryPath}`);
        exit(1);
    }

    // Check the permissions of the binary
    const permissions = fs.statSync(binaryPath).mode;
    const isExecutable = (permissions & fs.constants.S_IXUSR) !== 0;

    // Set executable permission if necessary
    if (!isExecutable) {
        fs.chmodSync(binaryPath, '755');
        console.log(`Executable permission set for binary at ${binaryPath}`);
    }

    const repoDir = path.join(homeDir, 'jacked');
    const execOptions: ExecOptions = {
        cwd: repoDir, // <-- Set working directory to the cloned repo
        maxBuffer: 1024 * 1024 * 250, // 250MB
        shell: '/bin/bash',
    };

    // Build the command string with the absolute binary path
    const fullCommand = [binaryPath, ...restArgs].join(' ');

    const childProcess = exec(fullCommand, execOptions);
    childProcess.stdout?.on('data', (data) => {
        const log = data.toString().trim();
        console.log(log);
    });

    childProcess.stderr?.on('data', (data) => {
        const log = data.toString().trim();
        console.error(log);
    });

    childProcess.on('error', (error) => {
        console.error(`Error running command: ${error.message}`);
        exit(1);
    });
    childProcess.on('exit', (code) => {
        let exitStatus = 0;
        console.log("***Checking Skip Build Fail: " + skipBuildFail);
        if (code === 0) {
            console.log(
                Styles.FgGreen +
                Styles.Bold  +
                Strings.JACKEDASSESSMENT +
                Common.PASSED +
                Styles.Reset
            );
            exit(0);
        } else {
            // Display fail
            console.error(
                Styles.FgRed +
                Styles.Bold +
                Strings.JACKEDASSESSMENT +
                Common.FAILED +
                Common.NEXTLINE +
                Strings.FAILCRITERIA +
                failedSeverity +
                Common.NEXTLINE +
                Strings.RECOMMENDATION +
                Styles.Reset
            );
            exitStatus = 1;

            if (skipBuildFail == "true") {
                console.log(
                    Styles.FgCyan +
                    Styles.Bold +
                    Strings.NOTE +
                    Strings.SKIPFAILBUILD +
                    Styles.Reset
                );
                exitStatus = 0;
            }
        }
        exit(exitStatus);
    });
}
