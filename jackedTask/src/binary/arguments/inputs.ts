import input = require('azure-pipelines-task-lib/task');
import { IInputs } from '../../../interface/input';

export async function getInputs(): Promise<IInputs> {
  const inputs: IInputs = {
    token: input.getInput("token", true) || "",
    scanType: input.getInput("scanType", true) || "",
    scanName: input.getInput("scanName", true) || "",
    failCriteria: input.getInput("failCriteria", true) || "",
    skipBuildFail: input.getInput("skipBuildFail", true) || "",
  };

  return inputs;
}
