import { executeCommand } from "./execute";

    const JACKED = "./jacked";
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
export async function runJackedCommand(inputs: {
    scanType: string;
    scanName: string;
    failCriteria: string;
    ignoreCves: string;
    ignorePackageNames: string;
    skipDbUpdate: boolean;
    skipFail: boolean;
}) {
    const args: string[] = [];
    let command: string | undefined;

    args.push(JACKED);
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

        // Skip DB Update
        if (inputs.skipDbUpdate === true) {
            args.push(SKIPDBUPDATE);
        }

        // Skip Fail needs to implement --
        // Save output file
        args.push(FILE);
        args.push('jacked-result.txt'); // Temporary file name --

        // Ignore Cves
        if (inputs.ignoreCves && inputs.ignoreCves.length > 0) {
            args.push(IGNOREVULNCVES);
            args.push(inputs.ignoreCves);
        }

        // Ignore Package Names
        if (inputs.ignorePackageNames && inputs.ignorePackageNames.length > 0) {
            args.push(IGNOREPACKAGENAMES);
            args.push(inputs.ignorePackageNames);
        }

        args.push(FAILCRITERIA);
        args.push(inputs.failCriteria);
        // Join all arguments
        command = args.join(' ')
    } else {
        console.log("Error generating arguments");
        return;
    }

    const successMessage = `'${JACKED}' command executed successfully`;
    const failureMessage = `Error running '${JACKED}' command`;

    try {

        executeCommand('ls', 'Command executed successfully', 'Error executing command');
        executeCommand(command, successMessage, failureMessage);
    } catch (error) {
        return error;
    }
}