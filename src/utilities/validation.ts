export interface Validatable {
  // Interface is for syntactical contract
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

export function validation(input: Validatable) {
  let isValid = true;
  if (input.required) {
    // Check if input is not empty
    isValid = isValid && input.value.toString().trim().length !== 0;
  }
  if (input.minLength !== null && typeof input.minLength === "string") {
    // Check if input has greater length than minLength
    isValid =
      isValid && input.value.toString().trim().length >= input.minLength;
  }
  if (input.maxLength !== null && typeof input.maxLength === "string") {
    // Check if input has greater length than maxLength
    isValid =
      isValid && input.value.toString().trim().length <= input.maxLength;
  }
  if (input.min !== null && typeof input.min === "number") {
    // Check if input has greater than min
    isValid = isValid && input.value >= input.min;
  }
  if (input.min !== null && typeof input.max === "number") {
    // Check if input has less than max
    isValid = isValid && input.value <= input.max;
  }
  return isValid;
}
