import { FunctionOptionsFactory } from '../interfaces/function-options-factory.interface';

export class DefaultFunctionOptionsFactory implements FunctionOptionsFactory {
  create(
    functionName: string,
    extraOptions?: Record<string, any> | undefined,
  ): Record<string, any> {
    return {
      bindings: [
        {
          authLevel: 'anonymous',
          type: 'httpTrigger',
          direction: 'in',
          name: 'req',
          route: `${functionName}/{*segments}`,
        },
        {
          type: 'http',
          direction: 'out',
          name: 'res',
        },
      ],
      scriptFile: './index.js',
    };
  }
}
