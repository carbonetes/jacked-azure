import { executeCommand } from "../execute/execute";

import { getInputs } from "./inputs";
import { constants } from '../../../constants/constants';


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

    let failureMessage = `${constants.CI_FAILURE} `;

    const inputs = await getInputs()
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

    if (INPUTVALUE.length > 0) {
        cmdArgs.push(INPUT);
        cmdArgs.push(INPUTVALUE);
    }

    if (SCANTYPEVALUE.length > 0) {
        cmdArgs.push(SCANTYPE);
        cmdArgs.push(SCANTYPEVALUE);
    }

    if (SEVERITYTYPEINPUT.length > 0) {
        cmdArgs.push(FAILCRITERIA);
        cmdArgs.push(SEVERITYTYPEINPUT);
    }

    // API
    if (TOKENINPUT.length > 0) {
        cmdArgs.push(TOKEN);
        cmdArgs.push(TOKENINPUT);
    }

    cmdArgs.push(PLUGIN);
    cmdArgs.push("azure");

    cmdArgs.push(ENVIRONMENT);
    cmdArgs.push("test");



    if (skipBuildFail == "true") {
        cmdArgs.push(SKIPFAIL);
    } else if (skipBuildFail == "false") {
        skipBuildFail = "false"
    } else {
        console.log(constants.CI_FAILURE + "Invalid input: " + skipBuildFail + " for " + SKIPFAIL + " flag. Choose: true or false only.")
    }

    command = [...cmdArgs].join(' ');
    console.log("Jacked Command: ", command); 


    try {
        executeCommand(command, failureMessage, skipBuildFail);
    } catch (error) {
        return error;
    }
}
