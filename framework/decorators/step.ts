import test from "@playwright/test";

export function step(
  target: (this: any, ...args: any[]) => any,
  context: ClassMethodDecoratorContext
) {
  return async function replacementMethod(this: any, ...args: any[]) {
    const stepName = `${this.constructor.name}.${String(context.name)}`;
    return await test.step(stepName, async () => {
      return await target.call(this, ...args);
    });
  };
}
