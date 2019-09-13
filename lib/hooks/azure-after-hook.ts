import {
  AfterHook,
  copyFileIfNotExists,
  writeFileSyncRecursive,
} from '@nestjs/serverless-core';
import fs from 'fs';
import { join } from 'path';
import { DefaultFunctionOptionsFactory } from '../factories/function-options.factory';
import { FunctionOptionsFactory } from '../interfaces/function-options-factory.interface';

const functionOptionsFactory = new DefaultFunctionOptionsFactory();

export const azureAfterHook = (
  outputDir = 'dist',
  optionsFactory: FunctionOptionsFactory = functionOptionsFactory,
): AfterHook => async (
  fileSystem: any,
  groupId: string,
  bundleText: string,
  extraOptions: Record<string, any>,
) => {
  const { app } = extraOptions;

  const rootAppDir = app ? join(outputDir, app) : outputDir;
  const bundlePath = join(rootAppDir, groupId, 'index.js');
  const functionJsonPath = join(rootAppDir, groupId, 'function.json');
  const functionOptions = JSON.stringify(
    optionsFactory.create(groupId),
    null,
    2,
  );

  writeFileSyncRecursive(fs, bundlePath, bundleText);
  writeFileSyncRecursive(fs, functionJsonPath, functionOptions);

  const templatesPath = join(__dirname, '..', 'templates');
  const hostFile = 'host.json';
  const proxiesFile = 'proxies.json';
  copyFileIfNotExists(
    join(rootAppDir, hostFile),
    join(templatesPath, hostFile),
  );
  copyFileIfNotExists(
    join(rootAppDir, proxiesFile),
    join(templatesPath, proxiesFile),
  );
};
