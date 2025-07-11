import input = require('azure-pipelines-task-lib/task');
import { IInputs } from '../../../interface/input';

export async function getInputs(): Promise<IInputs> {
  const inputs: IInputs = {
    token: input.getInput("token", false) || "",
    scanType: input.getInput("scanType", false) || "",
    scanName: input.getInput("scanName", false) || "",
    failCriteria: input.getInput("failCriteria", false) || "",
    skipBuildFail: input.getInput("skipBuildFail", false) || "",
  };

  return inputs;
}
