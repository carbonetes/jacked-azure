[![Jacked](images/logo.png)](https://github.com/carbonetes/jacked)

# Azure DevOps Plugin: Jacked

## Introduction

**Jacked** provides organizations with a more comprehensive look at their application to take calculated actions and create a better security approach. Its primary purpose is to scan vulnerabilities to implement subsequent risk mitigation measures.

## Task Usage

### Docker image scan example

```yaml
- task: Jacked@1
  inputs:
    scanType: 'image'
    scanName: 'ubuntu:latest'
    failCriteria: 'medium'
    ignoreCves: 
    ignorePackageNames:
```

## Prerequisites

- **Docker Plugin** for image pulling.

## Inputs Description

| Input Name                  | Description                                                  |
| --------------------------- | ------------------------------------------------------------ |
| scanType \*                 | Select Scan Type: image, tar, or directory. | 
| scanName \*                 | Input image name `image:tag`, tar file path, or directory path. |
| failCriteria \*             | Input a severity that will be found at or above given severity([unknown negligible low medium high critical]). Default: `low`. |
| ignoreCves                  | Input e.g. cve-2022-12423,cve-2021-23423 |
| ignorePackageNames          | Decides if it builds or stops the build based on the policy evaluation. |

_\* = required inputs._


## Output Description

| Output Name                  | Description                                                                                  |
| ---------------------------- | -------------------------------------------------------------------------------------------- |
| Vulnerabilities              | A list of known security risks that can be exploited by a threat actor listed with severities. |
| Software Compositions        | Software that might cause a security risk listed with severities. |
| Software Dependencies        | Pieces of software that rely on each other listed with vulnerability counts. |
| Licenses                     | Legal compliance found on each software of the scanned image. |
| Malware                      | Virus threats found on the scanned image. |
| Secrets                      | Secret data found on each software of the scanned image. |
| Bill of Materials            | A list of all the components exist in a software. |
| Policy Result                | The result of the policy evaluation, `PASSED` or `FAILED`. |
| Final Action                 | Decide if the build will `STOP` or `GO` based on the policy evaluation. |

## Complete CI/CD Example

```yaml
trigger:
- main

pool:
  vmImage: ubuntu-latest

steps:
- task: Jacked@1
  inputs:
    scanType: 'directory'
    scanName: '.'
    failCriteria: 'medium'
    ignoreCves: 
    ignorePackageNames: 'gorm.io/driver/sqlite'
```

## Support
To help with this task extension, or have an issue or feature request, please contact: [eng@carbonetes.com](eng@carbonetes.com)

If reporting an issue, please include:

* the version of the task extension
* relevant logs and error messages
* steps to reproduce

## License and Copyright

Licensed under [MIT License](LICENSE).