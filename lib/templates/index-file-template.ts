import { IndexFileTemplateFactory } from '@nestjs/serverless-core';
import { defaultEntryFilename } from '../constants';

export const defaultEntryModulePath = `./${defaultEntryFilename}`;

export const indexFileTemplate = (
  moduleName: string,
  functionName: string,
  isProcessor?: boolean,
) => `
import { Context, HttpRequest } from '@azure/functions';
import { AzureHttpAdapter } from '@nestjs/azure-func-http';
import { NestFactory } from '@nestjs/core';
import { ${moduleName} } from '${defaultEntryModulePath}';
${isProcessor ? "import processor from './app.processor'" : ''}

export async function createApp() {
  let app = await NestFactory.create(${moduleName});
  ${isProcessor ? 'app = await processor(app, "' + functionName + '");' : ''}

  app.setGlobalPrefix('api/${functionName}');
  await app.init();
  return app;
}

module.exports = function(context: Context, req: HttpRequest): void {
  AzureHttpAdapter.handle(createApp, context, req);
}
`;

export const indexFileTemplateFactory = (
  isProcessor: boolean,
): IndexFileTemplateFactory => (
  moduleName: string,
  functionName: string,
  moduleImportPath: string,
) => indexFileTemplate(moduleName, functionName, isProcessor);
