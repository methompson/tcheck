import { readFile, writeFile } from 'node:fs/promises';

import { isRecord, isString } from '@metools/tcheck';
import { Command } from 'commander';
import chalk from 'chalk';

main().catch((error) => {
  console.error(chalk.red('Error executing version bump:'), error);
  process.exit(1);
});

async function main() {
  const program = new Command();
  program
    .name('Application Version Bumper')
    .description('Bumps the version of the application')
    .version('1.0.0');

  program
    .command('major')
    .description('Bumps the major version and sets minor and patch to 0')
    .action(async () => {
      await bumpMajorVersion();
    });

  program
    .command('minor')
    .description('Bumps the minor version and sets patch to 0')
    .action(async () => {
      await bumpMinorVersion();
    });

  program
    .command('patch')
    .description('Bumps the patch version')
    .action(async () => {
      await bumpPatchVersion();
    });

  program.parse();
}

interface Version {
  major: number;
  minor: number;
  patch: number;
}

async function bumpPatchVersion(): Promise<void> {
  const { version, packageObject } = await getNeededData();

  version.patch += 1;

  await writeDataToFile(packageObject, version);
}

async function bumpMinorVersion(): Promise<void> {
  const { version, packageObject } = await getNeededData();

  version.minor += 1;
  version.patch = 0;

  await writeDataToFile(packageObject, version);
}

async function bumpMajorVersion(): Promise<void> {
  const { version, packageObject } = await getNeededData();

  version.major += 1;
  version.minor = 0;
  version.patch = 0;

  await writeDataToFile(packageObject, version);
}

async function getNeededData(): Promise<{
  version: Version;
  packageObject: Record<string, unknown>;
}> {
  const file = await readPackageFile();
  const currentVersion = file.version;

  if (!isString(currentVersion)) {
    throw new Error('Version is not a string in package.json');
  }

  const version = splitVersion(currentVersion);

  return {
    version,
    packageObject: file,
  };
}

async function readPackageFile() {
  const packageJsonPath = './package.json';
  const packageJsonData = await readFile(packageJsonPath, 'utf-8');
  const packageJson = JSON.parse(packageJsonData);

  if (!isRecord(packageJson)) {
    throw new Error('Invalid package.json format');
  }

  return packageJson;
}

async function writeDataToFile(
  packageObject: Record<string, unknown>,
  version: Version,
) {
  packageObject.version = `${version.major}.${version.minor}.${version.patch}`;
  // console.log(JSON.stringify(packageObject, null, 2));

  await writeFile(
    './package.json',
    JSON.stringify(packageObject, null, 2) + '\n',
  );
}

function splitVersion(version: string): Version {
  const versionParts = version.split('.').map(Number);
  if (versionParts.length !== 3) {
    throw new Error('Version format is incorrect. Expected format: x.y.z');
  }

  return {
    major: versionParts[0],
    minor: versionParts[1],
    patch: versionParts[2],
  };
}
