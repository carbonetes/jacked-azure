import { executeCommand } from "../execute/execute";

import { getInputs } from "./inputs";
import { constants } from "../../../constants/constants";


// Binary: Carbonetes-CI Command Flags
// ANALYZER
const CarbonetesCI = "carbonetes-ci"
const ANALYZER = "--analyzer"
const INPUT = "--input"
const JACKED = "jacked"
const SCANTYPE = "--scan-type"
const FAILCRITERIA = "--fail-criteria"
const SKIPFAIL = "--skip-fail"
// API
const TOKEN = "--token"
const PLUGIN = "--plugin-type"
const ENVIRONMENT = "--environment-type"

// Function to run the 'jacked' command
export async function setArguments() {

    let failureMessage = `${constants.CI_FAILURE} Error running '${JACKED}' command`;

    const inputs = await getInputs()
    let failedSeverity = inputs.failCriteria;
    let skipBuildFail = inputs.skipBuildFail;
    let INPUTVALUE = inputs.scanName;
    let SCANTYPEVALUE = inputs.scanType;
    let SEVERITYTYPEINPUT = inputs.failCriteria;
    let TOKENINPUT = inputs.token;

    const cmdArgs: string[] = [];
    let command: string | undefined;

    

    // ANALYZER
    cmdArgs.push(CarbonetesCI);
    cmdArgs.push(ANALYZER);
    cmdArgs.push(JACKED);

    cmdArgs.push(INPUT);
    cmdArgs.push(INPUTVALUE);

    cmdArgs.push(SCANTYPE);
    cmdArgs.push(SCANTYPEVALUE);

    cmdArgs.push(FAILCRITERIA);
    cmdArgs.push(SEVERITYTYPEINPUT);

    // API
    cmdArgs.push(TOKEN);
    cmdArgs.push(TOKENINPUT);

    cmdArgs.push(PLUGIN);
    cmdArgs.push("azure");

    cmdArgs.push(ENVIRONMENT);
    cmdArgs.push("test");



    if (skipBuildFail) {
        cmdArgs.push(SKIPFAIL);
    } else {
        skipBuildFail = "false"
    }

    command = [JACKED, ...cmdArgs].join(' ');
    console.log("Jacked Command: ", command); 


    try {
        executeCommand(command, failedSeverity, failureMessage, skipBuildFail);
    } catch (error) {
        return error;
    }
}
