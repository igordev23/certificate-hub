export interface VerifyResult {
  isAuthentic: boolean;
  isValid: boolean;
  certificate: null | {
    recipientName: string;
    courseName: string;
    courseHours: number;
    issuedAt: string;
    validityDate: string;
    verificationCode: string;
  };
}
