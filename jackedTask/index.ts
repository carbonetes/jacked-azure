import input = require('azure-pipelines-task-lib/task');
import { runJackedCommand } from './src/binary/buildArgs';
import { runScript  } from './src/binary/install';

// Inputs
const inputs = {
    scanType: input.getInput("scanType", true) || "",
    scanName: input.getInput("scanName", true) || "",
    failCriteria: input.getInput("failCriteria", true) || "",
    ignoreCves: input.getInput("ignoreCves", false) || "",
    ignorePackageNames: input.getInput("ignorePackageNames", false) || "",
    skipDbUpdate: Boolean(input.getInput("skipDbUpdate", false)) || false,
    skipFail: Boolean(input.getInput("skipFail", true)) || false,
};

runScript()
    .catch((error) => {
        console.error('Failed to download and execute install shell script:', error);
        failBuild('Failed to download and execute install shell script');
    })
    .then(() => {
        runJacked();
    });


function runJacked() {
    runJackedCommand(inputs)
        .catch((error) => {
            console.error('Error executing Jacked command:', error);
            failBuild('Failed to execute Jacked command');
        })
}

function failBuild(errorMessage: string) {
    console.error(errorMessage);
    process.exit(1);
}
