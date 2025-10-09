// 모든 스키마를 한 곳에서 export
export * from './payment';
export * from './validation';

// 스키마 타입 추출
export type PaymentFormData = z.infer<typeof paymentFormSchema>;
export type PaymentInfo = z.infer<typeof paymentInfoSchema>;
export type PaymentAmount = z.infer<typeof paymentAmountSchema>;
export type PaymentResult = z.infer<typeof paymentResultSchema>;
export type ValidationError = z.infer<typeof validationErrorSchema>;
export type ValidationResult = z.infer<typeof validationResultSchema>;
export type TossPaymentsResponse = z.infer<typeof tossPaymentsResponseSchema>;
export type PaymentApprovalRequest = z.infer<typeof paymentApprovalRequestSchema>;
export type ValidationOptions = z.infer<typeof validationOptionsSchema>;
export type ValidationContext = z.infer<typeof validationContextSchema>;

// 개별 필드 검증 스키마 타입
export type FieldValidationSchemas = typeof fieldValidationSchemas;
export type StepValidationSchemas = typeof stepValidationSchemas;

// 필드명 타입
export type PaymentFormField = keyof PaymentFormData;
export type ValidationField = keyof FieldValidationSchemas;
