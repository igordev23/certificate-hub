import { isAfter } from "date-fns";

export interface Certificate {
  id: string;
  recipientName: string;
  recipientCPF: string;
  courseName: string;
  courseHours: number;
  verificationCode: string;
  validityDate: string;
  templateId: string;
  issuedAt: string;
  createdAt: string;
  updatedAt: string;
}

export function isExpired(validityDate: string): boolean {
  return isAfter(new Date(), new Date(validityDate));
}
