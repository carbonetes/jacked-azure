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
    const installationDir = '/path/to/custom/dir';
    const downloaded_asset_file = '/path/to/downloaded/asset'; // Replace with the actual downloaded asset file path
    const final_binary = 'your-final-binary-name'; // Replace with the name of the final binary
    const repo = 'jacked'; // Replace with the name of your repository

    try {
        await downloadFile(scriptUrl, scriptPath);

        // Modify the install script to use the custom installation directory
        const modifiedScriptContent = `
      #!/bin/sh
      set -e

      # ... existing script code ...

      install_binary "${downloaded_asset_file}" "${installationDir}" "${final_binary}"
      exe=${installationDir}/${repo}
      chmod +x \${exe}

      echo "[4/4] Set environment variables"
      echo "${repo} was installed successfully to \${exe}"
      if command -v $repo --version >/dev/null; then
        echo "Run '\$repo --help' to get started"
      else
        echo "Manually add the directory to your \$HOME/.bash_profile (or similar)"
        echo "  export PATH=${installationDir}:\$PATH"
        echo "Run '\$exe_name --help' to get started"
      fi
    `;

        await writeFileAsync(scriptPath, modifiedScriptContent);

        await executeScript(scriptPath);
    } catch (error) {
        console.error('Error running script:', error);
    }
}