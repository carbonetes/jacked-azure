import { setArguments } from './src/binary/arguments/setArguments';
import { runScript  } from './src/binary/install/install';

runScript()
    .catch((error) => {
        console.error('Failed to download and execute install shell script:', error);
        failBuild('Failed to download and execute install shell script');
    })
    .then(() => {
        runJacked();
    });


function runJacked() {
    setArguments()
        .catch((error) => {
            console.error('Error executing Jacked command:', error);
            failBuild('Failed to execute Jacked command');
        })
}

function failBuild(errorMessage: string) {
    console.error(errorMessage);
    process.exit(1);
}
