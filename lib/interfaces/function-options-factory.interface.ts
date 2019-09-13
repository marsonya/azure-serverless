import { FunctionOptions } from './function-options.interface';

export interface FunctionOptionsFactory {
  create(
    functionName: string,
    extraOptions?: Record<string, any>,
  ): FunctionOptions;
}
