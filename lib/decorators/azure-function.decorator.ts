export type AzureFunctionOptionsKeys = 'name' | 'app' | string;

export function AzureFunction(
  options?: Record<AzureFunctionOptionsKeys, any>,
): ClassDecorator {
  return () => {};
}
