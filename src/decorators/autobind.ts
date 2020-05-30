namespace App {
  // Binding "this" keyword to method
  export function autobind(_: any, _two: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const newMethod: PropertyDescriptor = {
      configurable: true,
      get() {
        const boundFunction = originalMethod.bind(this);
        return boundFunction;
      },
    };
    return newMethod;
  }
}