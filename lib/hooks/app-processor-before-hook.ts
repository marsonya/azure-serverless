import {
  appendTsExtension,
  BeforeHook,
  getFileContent,
  writeFileSyncRecursive,
} from '@nestjs/serverless-core';
import { dirname, join, relative } from 'path';
import { defaultProcessorFilename } from '../constants';

export const appProcessorBeforeHook = (
  rootDir: string,
  appProcessorPath: string,
): BeforeHook => async (fileSystem: any, entries: string[]) => {
  const entriesDirs = entries.map(entry => dirname(entry));
  const appProcessorFullPath = join(rootDir, appProcessorPath);
  const pathToSave = dirname(relative(rootDir, appProcessorFullPath));
  const appProcessorContent = await getFileContent(appProcessorFullPath);

  entriesDirs.forEach(entry => {
    const processorPath = appendTsExtension(
      join(entry, pathToSave, defaultProcessorFilename),
    );
    writeFileSyncRecursive(fileSystem, processorPath, appProcessorContent);
  });
};
