export function validation(input) {
    let isValid = true;
    if (input.required) {
        isValid = isValid && input.value.toString().trim().length !== 0;
    }
    if (input.minLength !== null && typeof input.minLength === "string") {
        isValid =
            isValid && input.value.toString().trim().length >= input.minLength;
    }
    if (input.maxLength !== null && typeof input.maxLength === "string") {
        isValid =
            isValid && input.value.toString().trim().length <= input.maxLength;
    }
    if (input.min !== null && typeof input.min === "number") {
        isValid = isValid && input.value >= input.min;
    }
    if (input.min !== null && typeof input.max === "number") {
        isValid = isValid && input.value <= input.max;
    }
    return isValid;
}
//# sourceMappingURL=validation.js.map