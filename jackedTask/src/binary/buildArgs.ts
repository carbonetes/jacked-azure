import { executeCommand } from "./execute";
import input = require('azure-pipelines-task-lib/task');

const JACKED = "jacked"; // The installed binary name
const FAILCRITERIA = "--fail-criteria";
const DIR = "--dir";
const TAR = "--tar";
const SBOM = "--sbom";
const CIMODE = "--ci";
const TOKEN = "--token";
const FILE = "--file";
const SKIPDBUPDATE = "--skip-db-update";
const IGNOREPACKAGENAMES = "--ignore-package-names";
const IGNOREVULNCVES = "--ignore-vuln-cves";
const PLUGIN = "--plugin"; 

// Function to run the 'jacked' command
export async function runJackedCommand() {

    // Inputs
    const inputs = {
        token: input.getInput("token", true) || "",
        scanType: input.getInput("scanType", true) || "",
        scanName: input.getInput("scanName", true) || "",
        failCriteria: input.getInput("failCriteria", true) || "",
        skipDbUpdate: Boolean(input.getInput("skipDbUpdate", false)),
        skipBuildFail: input.getInput("skipBuildFail", true) || "",
    };

    console.log("Checking Skip Build Fail: ", inputs.skipBuildFail);


    const args: string[] = [];
    let command: string | undefined;

    // CI MODE
    args.push(CIMODE);
    args.push(TOKEN);
    args.push(inputs.token);
    args.push(PLUGIN);
    args.push("azure");

    if (args.length > 0) {

        // Scan Type
        switch (inputs.scanType) {
            case 'image':
                // Handle image scan case
                console.log('Performing image scan');
                args.push(inputs.scanName);
                break;
            case 'tar':
                // Handle tar scan case
                console.log('Performing tar scan');
                args.push(TAR);
                args.push(inputs.scanName);
                break;
            case 'directory':
                // Handle directory scan case
                console.log('Performing directory scan');
                args.push(DIR);
                args.push(inputs.scanName);
                break;
            default:
                // Handle image scan case
                console.log('Performing image scan');
                args.push(inputs.scanName);
                break;
        }

        args.push(FAILCRITERIA);
        args.push(inputs.failCriteria);
        // Join all arguments and prepend the binary
        command = [JACKED, ...args].join(' ');
        console.log("Jacked Command: ", command); // 
    } else {
        console.log("Error generating arguments");
        return;
    }

    let failedSeverity = inputs.failCriteria;
    let skipBuildFail = inputs.skipBuildFail;
    let failureMessage = `Error running '${JACKED}' command`;

    try {
        executeCommand(command, failedSeverity, failureMessage, skipBuildFail);
    } catch (error) {
        return error;
    }
}