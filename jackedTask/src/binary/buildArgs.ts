import { executeCommand } from "./execute";
import input = require('azure-pipelines-task-lib/task');

const JACKED = "jacked";
const FAILCRITERIA = "--fail-criteria";
const DIR = "--dir";
const TAR = "--tar";
const SBOM = "--sbom";
const CIMODE = "--ci";
const FILE = "--file";
const SKIPDBUPDATE = "--skip-db-update";
const IGNOREPACKAGENAMES = "--ignore-package-names";
const IGNOREVULNCVES = "--ignore-vuln-cves";

// Function to run the 'jacked' command
export async function runJackedCommand() {

    // Inputs
    const inputs = {
        scanType: input.getInput("scanType", true) || "",
        scanName: input.getInput("scanName", true) || "",
        failCriteria: input.getInput("failCriteria", true) || "",
        ignoreCves: input.getInput("ignoreCves", false) || "",
        ignorePackageNames: input.getInput("ignorePackageNames", false) || "",
        skipDbUpdate: Boolean(input.getInput("skipDbUpdate", false)),
        skipBuildFail: Boolean(input.getInput("skipBuildFail", false)) || false,
    };

    console.log("Checking Skip Build Fail: ", inputs.skipBuildFail);


    const args: string[] = [];
    let command: string | undefined;

    // CI MODE
    args.push(CIMODE);

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

        // Save output file
        // args.push(FILE);
        // args.push('jacked-result.txt'); // Temporary file name --

        // Ignore Cves
        // if (inputs.ignoreCves && inputs.ignoreCves.length > 0) {
        //     args.push(IGNOREVULNCVES);
        //     args.push(inputs.ignoreCves);
        // }

        // Ignore Package Names
        // if (inputs.ignorePackageNames && inputs.ignorePackageNames.length > 0) {
        //     args.push(IGNOREPACKAGENAMES);
        //     args.push(inputs.ignorePackageNames);
        // }

        args.push(FAILCRITERIA);
        args.push(inputs.failCriteria);
        // Join all arguments
        command = args.join(' ')
        console.log("jacked " + command);
    } else {
        console.log("Error generating arguments");
        return;
    }

    const failedSeverity = inputs.failCriteria;
    const skipBuildFail = inputs.skipBuildFail;
    const failureMessage = `Error running '${JACKED}' command`;

    try {
        executeCommand(command, failedSeverity, failureMessage, skipBuildFail);
    } catch (error) {
        return error;
    }
}
