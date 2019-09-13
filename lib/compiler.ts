import { Compiler, CompilerOptions } from '@nestjs/serverless-core';
import { join } from 'path';
import { AzureFunction } from './decorators';
import { appProcessorBeforeHook } from './hooks/app-processor-before-hook';
import { azureAfterHook } from './hooks/azure-after-hook';
import { FunctionOptionsFactory } from './interfaces/function-options-factory.interface';
import { indexFileTemplateFactory } from './templates/index-file-template';

export interface AzureCompilerOptions extends CompilerOptions {
  sourceDir: string;
  outputDir?: string;
  appProcessorPath?: string;
  functionOptionsFactory?: FunctionOptionsFactory;
}

export class AzureCompiler extends Compiler {
  async run(
    options: AzureCompilerOptions = {
      sourceDir: join(process.cwd(), 'src'),
    },
  ) {
    const afterHooks = (options.afterHooks || []).concat(
      azureAfterHook(options.outputDir, options.functionOptionsFactory),
    );
    let beforeHooks = options.beforeHooks || [];
    if (options.appProcessorPath) {
      beforeHooks = beforeHooks.concat(
        appProcessorBeforeHook(options.sourceDir, options.appProcessorPath),
      );
    }
    return super.run({
      ...options,
      beforeHooks,
      afterHooks,
      groupDecorator: AzureFunction.name,
      indexFileTemplateFactory: indexFileTemplateFactory(
        !!options.appProcessorPath,
      ),
    });
  }
}
