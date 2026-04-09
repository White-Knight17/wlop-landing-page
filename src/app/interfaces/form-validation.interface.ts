export interface FormErrors {
  field: string;
  message: string;
  elementId: string;
}

export interface FormValidationResult {
  valid: boolean;
  errors: FormErrors[];
}
