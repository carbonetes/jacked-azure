import { runJackedCommand } from './src/binary/buildArgs';
import { runScript  } from './src/binary/install';

runScript()
    .catch((error) => {
        console.error('Failed to download and execute install shell script:', error);
        failBuild('Failed to download and execute install shell script');
    })
    .then(() => {
        runJacked();
    });


function runJacked() {
    runJackedCommand()
        .catch((error) => {
            console.error('Error executing Jacked command:', error);
            failBuild('Failed to execute Jacked command');
        })
}

function failBuild(errorMessage: string) {
    console.error(errorMessage);
    process.exit(1);
}
