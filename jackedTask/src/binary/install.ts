import { exec } from 'child_process';
import { writeFile } from 'fs';
import { promisify } from 'util';
import axios from 'axios';

const writeFileAsync = promisify(writeFile);

async function downloadFile(url: string, filePath: string): Promise<void> {
    const response = await axios.get(url, { responseType: 'text' });
    await writeFileAsync(filePath, response.data);
}

function executeScript(scriptPath: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const installProcess = exec(`sh ${scriptPath}`);

        installProcess.stderr?.on('data', (data) => {
            console.error(data.toString());
        });

        installProcess.on('exit', (code) => {
            if (code === 0) {
                console.log('Script executed successfully');
                resolve();
            } else {
                const errorMessage = `Error executing script. Exit code: ${code}`;
                console.error(errorMessage);
                reject(errorMessage);
            }
        });
    });
}

export async function runScript(): Promise<void> {
    const scriptUrl = 'https://raw.githubusercontent.com/carbonetes/jacked/main/install.sh';
    const scriptPath = './install.sh';

    try {
        await downloadFile(scriptUrl, scriptPath);
        await executeScript(scriptPath);
    } catch (error) {
        console.error('Error running script:', error);
    }
}