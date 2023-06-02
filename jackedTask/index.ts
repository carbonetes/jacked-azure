import  input                                                              =       require('azure-pipelines-task-lib/task');
import { downloadAndExecuteScript } from './src/binary/install';
import { runJackedCommand } from './src/binary/buildArgs';
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
downloadAndExecuteScript()
runJackedCommand(inputs)
    .then(() => {
        console.log('Jacked command executed successfully');
    })
    .catch((error) => {
        console.error('Error executing Jacked command:', error);
    });
