export function autobind(_, _two, descriptor) {
    const originalMethod = descriptor.value;
    const newMethod = {
        configurable: true,
        get() {
            const boundFunction = originalMethod.bind(this);
            return boundFunction;
        },
    };
    return newMethod;
}
//# sourceMappingURL=autobind.js.map