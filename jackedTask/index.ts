import input = require('azure-pipelines-task-lib/task');
import { installHomebrew } from './src/homebrew/install';
import { runJackedCommand } from './src/binary/buildArgs';
import { tapRepository } from './src/homebrew/jacked';

// Inputs
const inputs = {
    scanType: input.getInput("scanType", true) || "",
    scanName: input.getInput("scanName", true) || "",
    failCriteria: input.getInput("failCriteria", true) || "",
    ignoreCves: input.getInput("ignoreCves", false) || "",
    ignorePackageNames: input.getInput("ignorePackageNames", false) || "",
    skipDbUpdate: Boolean(input.getInput("skipDbUpdate", false)),
    skipFail: Boolean(input.getInput("skipFail", false))
};

// Call the function to download and execute the shell script
installHomebrew()
    .catch((error) => {
        console.error('Error installing Homebrew:', error);
        failBuild('Failed to install Homebrew');
    })
    .then(() => {
        tapJacked();
    });

function tapJacked() {
    tapRepository()
        .catch((error) => {
            console.error('Error tapping repository:', error);
            failBuild('Failed to tap repository');
        })
        .then(() => {
            runJacked();
        });
}

function runJacked() {
    runJackedCommand(inputs)
        .catch((error) => {
            console.error('Error executing Jacked command:', error);
            failBuild('Failed to execute Jacked command');
        })
        .then(() => {
            console.log('Executing Jacked');
        });
}

function failBuild(errorMessage: string) {
    console.error(errorMessage);
    process.exit(1);
}
