import { api, isExpired } from "../../src/services/api";

const BASE_URL = process.env.VITE_API_URL || "http://localhost:3000";
const mockFetch = jest.fn();
globalThis.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
});

function mockResponse(data: unknown, ok = true) {
  return Promise.resolve({
    ok,
    status: ok ? 200 : 400,
    json: () => Promise.resolve(data),
  } as Response);
}

function mockErrorBody(error: string, details?: unknown) {
  const body: Record<string, unknown> = { error };
  if (details) body.details = details;
  return Promise.resolve({
    ok: false,
    status: 400,
    json: () => Promise.resolve(body),
  } as Response);
}

function mockJsonError() {
  return Promise.resolve({
    ok: false,
    status: 500,
    json: () => Promise.reject(new Error("invalid json")),
  } as Response);
}

describe("isExpired", () => {
  it("returns true for past date", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-06-10"));
    expect(isExpired("2025-01-01")).toBe(true);
    jest.useRealTimers();
  });

  it("returns false for future date", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-06-10"));
    expect(isExpired("2027-01-01")).toBe(false);
    jest.useRealTimers();
  });
});

describe("api.http (via listTemplates)", () => {
  it("returns data from successful response using data field", async () => {
    const templates = [{ id: "1", name: "T1" }];
    mockFetch.mockResolvedValue(mockResponse({ data: templates }));
    const result = await api.listTemplates();
    expect(result).toEqual(templates);
    expect(mockFetch).toHaveBeenCalledWith(
      `${BASE_URL}/api/templates`,
      expect.objectContaining({
        headers: { "Content-Type": "application/json" },
      }),
    );
  });

  it("returns JSON directly when no data field", async () => {
    const certs = [{ id: "c1" }];
    mockFetch.mockResolvedValue(mockResponse(certs));
    const result = await api.listCertificates();
    expect(result).toEqual(certs);
  });

  it("throws error with details when body has details", async () => {
    mockFetch.mockResolvedValue(
      mockErrorBody("Erro de validação", [{ field: "name", message: "Nome obrigatório" }]),
    );
    await expect(api.listTemplates()).rejects.toMatchObject({
      message: "Erro de validação",
      details: [{ field: "name", message: "Nome obrigatório" }],
    });
  });

  it("throws generic HTTP error when body has no details", async () => {
    mockFetch.mockResolvedValue(mockErrorBody("Not found"));
    await expect(api.getTemplate("x")).rejects.toThrow("Not found");
  });

  it("throws HTTP status when json parse fails", async () => {
    mockFetch.mockResolvedValue(mockJsonError());
    await expect(api.getTemplate("x")).rejects.toThrow("HTTP 500");
  });

  it("throws HTTP 401 when response is 401 with no error body", async () => {
    mockFetch.mockResolvedValue(
      Promise.resolve({
        ok: false,
        status: 401,
        json: () => Promise.reject(new Error("invalid json")),
      } as Response),
    );
    await expect(api.listTemplates()).rejects.toThrow("HTTP 401");
  });

  it("throws error message when response is 401 with error body", async () => {
    mockFetch.mockResolvedValue(
      Promise.resolve({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: "Unauthorized" }),
      } as Response),
    );
    await expect(api.listTemplates()).rejects.toThrow("Unauthorized");
  });
});

describe("api methods", () => {
  beforeEach(() => {
    mockFetch.mockResolvedValue(mockResponse({ data: {} }));
  });

  it("getTemplate calls GET with id", async () => {
    await api.getTemplate("tpl-1");
    expect(mockFetch).toHaveBeenCalledWith(
      `${BASE_URL}/api/templates/tpl-1`,
      expect.anything(),
    );
  });

  it("createTemplate calls POST with body", async () => {
    await api.createTemplate({ name: "Novo" });
    expect(mockFetch).toHaveBeenCalledWith(
      `${BASE_URL}/api/templates`,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ name: "Novo" }),
      }),
    );
  });

  it("updateTemplate calls PUT with partial body", async () => {
    await api.updateTemplate("tpl-1", { name: "Editado" });
    expect(mockFetch).toHaveBeenCalledWith(
      `${BASE_URL}/api/templates/tpl-1`,
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({ name: "Editado" }),
      }),
    );
  });

  it("deleteTemplate calls DELETE", async () => {
    mockFetch.mockResolvedValue(mockResponse({ data: null }));
    await api.deleteTemplate("tpl-1");
    expect(mockFetch).toHaveBeenCalledWith(
      `${BASE_URL}/api/templates/tpl-1`,
      expect.objectContaining({ method: "DELETE" }),
    );
  });

  it("getCertificate calls GET with id", async () => {
    await api.getCertificate("cert-1");
    expect(mockFetch).toHaveBeenCalledWith(
      `${BASE_URL}/api/certificates/cert-1`,
      expect.anything(),
    );
  });

  it("emitCertificate calls POST with certificate data", async () => {
    const body = {
      recipientName: "João",
      recipientCPF: "52998224725",
      courseName: "Curso",
      courseHours: 40,
      validityDate: "2027-01-01T00:00:00.000Z",
      templateId: "tpl-1",
    };
    await api.emitCertificate(body);
    expect(mockFetch).toHaveBeenCalledWith(
      `${BASE_URL}/api/certificates/emit`,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(body),
      }),
    );
  });

  it("updateValidity calls PUT with validityDate", async () => {
    await api.updateValidity("cert-1", "2027-06-10T00:00:00.000Z");
    expect(mockFetch).toHaveBeenCalledWith(
      `${BASE_URL}/api/certificates/cert-1/validity`,
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({ validityDate: "2027-06-10T00:00:00.000Z" }),
      }),
    );
  });

  it("updateCertificate calls PUT with partial body", async () => {
    await api.updateCertificate("cert-1", { courseName: "Novo Curso" });
    expect(mockFetch).toHaveBeenCalledWith(
      `${BASE_URL}/api/certificates/cert-1`,
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({ courseName: "Novo Curso" }),
      }),
    );
  });

  it("pdfUrl returns correct URL", () => {
    const url = api.pdfUrl("cert-1");
    expect(url).toBe(`${BASE_URL}/api/certificates/cert-1/pdf`);
  });

  it("verify calls POST with CPF and code", async () => {
    mockFetch.mockResolvedValue(mockResponse({ data: { isValid: true } }));
    await api.verify("52998224725", "ABC123");
    expect(mockFetch).toHaveBeenCalledWith(
      `${BASE_URL}/api/verify`,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ cpf: "52998224725", verificationCode: "ABC123" }),
      }),
    );
  });
});
