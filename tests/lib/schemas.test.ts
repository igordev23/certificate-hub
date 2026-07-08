import {
  emitCertificateSchema,
  createTemplateSchema,
  updateCertificateSchema,
} from "../../src/lib/schemas";

describe("emitCertificateSchema", () => {
  it("accepts valid data", () => {
    const result = emitCertificateSchema.safeParse({
      recipientName: "João Silva",
      recipientCPF: "52998224725",
      courseName: "React",
      courseHours: 40,
      templateId: "tpl-1",
      validityDate: "2027-01-01",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = emitCertificateSchema.safeParse({
      recipientName: "",
      recipientCPF: "52998224725",
      courseName: "React",
      courseHours: 40,
      templateId: "tpl-1",
      validityDate: "2027-01-01",
    });
    expect(result.success).toBe(false);
  });

  it("rejects CPF with less than 11 digits", () => {
    const result = emitCertificateSchema.safeParse({
      recipientName: "João",
      recipientCPF: "1234567890",
      courseName: "React",
      courseHours: 40,
      templateId: "tpl-1",
      validityDate: "2027-01-01",
    });
    expect(result.success).toBe(false);
  });

  it("rejects CPF with all same digits", () => {
    const result = emitCertificateSchema.safeParse({
      recipientName: "João",
      recipientCPF: "11111111111",
      courseName: "React",
      courseHours: 40,
      templateId: "tpl-1",
      validityDate: "2027-01-01",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid CPF with formatting", () => {
    const result = emitCertificateSchema.safeParse({
      recipientName: "João",
      recipientCPF: "529.982.247-25",
      courseName: "React",
      courseHours: 40,
      templateId: "tpl-1",
      validityDate: "2027-01-01",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid CPF with wrong check digits", () => {
    const result = emitCertificateSchema.safeParse({
      recipientName: "João",
      recipientCPF: "52998224726",
      courseName: "React",
      courseHours: 40,
      templateId: "tpl-1",
      validityDate: "2027-01-01",
    });
    expect(result.success).toBe(false);
  });

  it("rejects hours less than 1", () => {
    const result = emitCertificateSchema.safeParse({
      recipientName: "João",
      recipientCPF: "52998224725",
      courseName: "React",
      courseHours: 0,
      templateId: "tpl-1",
      validityDate: "2027-01-01",
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional email", () => {
    const withEmail = emitCertificateSchema.safeParse({
      recipientName: "João",
      recipientCPF: "52998224725",
      courseName: "React",
      courseHours: 40,
      templateId: "tpl-1",
      validityDate: "2027-01-01",
      email: "joao@test.com",
    });
    expect(withEmail.success).toBe(true);

    const withoutEmail = emitCertificateSchema.safeParse({
      recipientName: "João",
      recipientCPF: "52998224725",
      courseName: "React",
      courseHours: 40,
      templateId: "tpl-1",
      validityDate: "2027-01-01",
    });
    expect(withoutEmail.success).toBe(true);
  });
});

describe("updateCertificateSchema", () => {
  it("accepts valid data", () => {
    const result = updateCertificateSchema.safeParse({
      recipientName: "João Silva",
      recipientCPF: "52998224725",
      courseName: "React",
      courseHours: 40,
      validityDate: "2027-01-01",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = updateCertificateSchema.safeParse({
      recipientName: "",
      recipientCPF: "52998224725",
      courseName: "React",
      courseHours: 40,
      validityDate: "2027-01-01",
    });
    expect(result.success).toBe(false);
  });

  it("rejects CPF with less than 11 digits", () => {
    const result = updateCertificateSchema.safeParse({
      recipientName: "João",
      recipientCPF: "1234567890",
      courseName: "React",
      courseHours: 40,
      validityDate: "2027-01-01",
    });
    expect(result.success).toBe(false);
  });

  it("rejects CPF with all same digits", () => {
    const result = updateCertificateSchema.safeParse({
      recipientName: "João",
      recipientCPF: "11111111111",
      courseName: "React",
      courseHours: 40,
      validityDate: "2027-01-01",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid CPF with formatting", () => {
    const result = updateCertificateSchema.safeParse({
      recipientName: "João",
      recipientCPF: "529.982.247-25",
      courseName: "React",
      courseHours: 40,
      validityDate: "2027-01-01",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid CPF with wrong check digits", () => {
    const result = updateCertificateSchema.safeParse({
      recipientName: "João",
      recipientCPF: "52998224726",
      courseName: "React",
      courseHours: 40,
      validityDate: "2027-01-01",
    });
    expect(result.success).toBe(false);
  });

  it("rejects hours less than 1", () => {
    const result = updateCertificateSchema.safeParse({
      recipientName: "João",
      recipientCPF: "52998224725",
      courseName: "React",
      courseHours: 0,
      validityDate: "2027-01-01",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty validityDate", () => {
    const result = updateCertificateSchema.safeParse({
      recipientName: "João",
      recipientCPF: "52998224725",
      courseName: "React",
      courseHours: 40,
      validityDate: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("createTemplateSchema", () => {
  it("accepts valid data", () => {
    const result = createTemplateSchema.safeParse({
      name: "Meu Template",
      description: "Descrição",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = createTemplateSchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
  });

  it("accepts data without description", () => {
    const result = createTemplateSchema.safeParse({ name: "Template" });
    expect(result.success).toBe(true);
  });
});
