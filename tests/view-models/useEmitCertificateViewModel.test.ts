import { renderHook, act, waitFor } from "@testing-library/react";
import { isValidCPF, formatCPF, useEmitCertificateViewModel } from "../../src/view-models/useEmitCertificateViewModel";

const mockTemplates = [
  { id: "tpl-1", name: "Default", description: "", layoutConfig: {}, createdAt: "", updatedAt: "" },
];

const mockNavigate = jest.fn();

jest.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock("../../src/services/api", () => ({
  api: {
    listTemplates: jest.fn(),
    emitCertificate: jest.fn(),
  },
}));

jest.mock("../../src/services/envios", () => ({
  envios: {
    add: jest.fn(),
  },
}));

import { api } from "../../src/services/api";
import { envios } from "../../src/services/envios";

beforeEach(() => {
  jest.clearAllMocks();
  mockNavigate.mockReset();
});

describe("isValidCPF", () => {
  it("rejects empty string", () => {
    expect(isValidCPF("")).toBe(false);
  });

  it("rejects CPF with less than 11 digits", () => {
    expect(isValidCPF("1234567890")).toBe(false);
  });

  it("rejects all same digits", () => {
    expect(isValidCPF("11111111111")).toBe(false);
    expect(isValidCPF("00000000000")).toBe(false);
  });

  it("accepts a valid CPF", () => {
    expect(isValidCPF("52998224725")).toBe(true);
  });

  it("accepts a valid CPF with formatting", () => {
    expect(isValidCPF("529.982.247-25")).toBe(true);
  });

  it("rejects invalid CPF", () => {
    expect(isValidCPF("52998224726")).toBe(false);
  });

  it("rejects CPF with wrong first check digit", () => {
    expect(isValidCPF("52998224715")).toBe(false);
  });

  it("rejects CPF with wrong second check digit", () => {
    expect(isValidCPF("52998224720")).toBe(false);
  });
});

describe("formatCPF", () => {
  it("returns raw digits for <= 3 chars", () => {
    expect(formatCPF("529")).toBe("529");
  });

  it("adds dot after 3rd digit", () => {
    expect(formatCPF("5299")).toBe("529.9");
  });

  it("adds second dot after 6th digit", () => {
    expect(formatCPF("5299822")).toBe("529.982.2");
  });

  it("adds dash after 9th digit", () => {
    expect(formatCPF("52998224725")).toBe("529.982.247-25");
  });

  it("strips non-digits and limits to 11 chars", () => {
    expect(formatCPF("529.982.247-25123")).toBe("529.982.247-25");
  });

  it("handles empty string", () => {
    expect(formatCPF("")).toBe("");
  });

  it("handles only non-digits", () => {
    expect(formatCPF("abc.def.ghi-jk")).toBe("");
  });
});

describe("useEmitCertificateViewModel", () => {
  it("loads templates on mount", async () => {
    (api.listTemplates as jest.Mock).mockResolvedValue(mockTemplates);
    const { result } = renderHook(() => useEmitCertificateViewModel());
    expect(result.current.loadingTemplates).toBe(true);
    await waitFor(() => expect(result.current.loadingTemplates).toBe(false));
    expect(result.current.templates).toEqual(mockTemplates);
    expect(result.current.form.templateId).toBe("tpl-1");
  });

  it("sets default form state", async () => {
    (api.listTemplates as jest.Mock).mockResolvedValue(mockTemplates);
    const { result } = renderHook(() => useEmitCertificateViewModel());
    await waitFor(() => expect(result.current.loadingTemplates).toBe(false));
    expect(result.current.form.recipientName).toBe("");
    expect(result.current.form.recipientCPF).toBe("");
    expect(result.current.form.courseHours).toBe(40);
    expect(result.current.submitting).toBe(false);
    expect(result.current.errors).toEqual([]);
  });

  it("setFormField updates form field", async () => {
    (api.listTemplates as jest.Mock).mockResolvedValue(mockTemplates);
    const { result } = renderHook(() => useEmitCertificateViewModel());
    await waitFor(() => expect(result.current.loadingTemplates).toBe(false));
    act(() => result.current.setFormField("recipientName", "João Silva"));
    expect(result.current.form.recipientName).toBe("João Silva");
  });

  it("setFormField formats CPF when field is recipientCPF", async () => {
    (api.listTemplates as jest.Mock).mockResolvedValue(mockTemplates);
    const { result } = renderHook(() => useEmitCertificateViewModel());
    await waitFor(() => expect(result.current.loadingTemplates).toBe(false));
    act(() => result.current.setFormField("recipientCPF", "52998224725"));
    expect(result.current.form.recipientCPF).toBe("529.982.247-25");
  });

  it("setFormField clears error for the field being edited", async () => {
    (api.listTemplates as jest.Mock).mockResolvedValue(mockTemplates);
    const { result } = renderHook(() => useEmitCertificateViewModel());
    await waitFor(() => expect(result.current.loadingTemplates).toBe(false));
    act(() => result.current.setFormField("recipientCPF", "123"));
    await act(async () => {
      await result.current.submit({ preventDefault: jest.fn() } as any);
    });
    act(() => result.current.setFormField("recipientCPF", "529.982.247-25"));
    expect(result.current.errors).toHaveLength(0);
  });

  it("submit validates CPF and sets error when invalid", async () => {
    (api.listTemplates as jest.Mock).mockResolvedValue(mockTemplates);
    const { result } = renderHook(() => useEmitCertificateViewModel());
    await waitFor(() => expect(result.current.loadingTemplates).toBe(false));
    act(() => result.current.setFormField("recipientCPF", "123"));
    await act(async () => {
      await result.current.submit({ preventDefault: jest.fn() } as any);
    });
    expect(result.current.errors).toEqual([
      { field: "recipientCPF", message: "CPF inválido. Digite um CPF com 11 dígitos válidos." },
    ]);
    expect(result.current.submitting).toBe(false);
  });

  it("submit calls emitCertificate and navigates on success", async () => {
    (api.listTemplates as jest.Mock).mockResolvedValue(mockTemplates);
    (api.emitCertificate as jest.Mock).mockResolvedValue({
      id: "cert-1",
      recipientName: "João Silva",
      recipientCPF: "52998224725",
      courseName: "React",
      courseHours: 40,
      verificationCode: "ABC123",
      validityDate: "2027-01-01T00:00:00.000Z",
      templateId: "tpl-1",
      issuedAt: "2026-06-10T00:00:00.000Z",
      createdAt: "2026-06-10T00:00:00.000Z",
      updatedAt: "2026-06-10T00:00:00.000Z",
    });
    const { result } = renderHook(() => useEmitCertificateViewModel());
    await waitFor(() => expect(result.current.loadingTemplates).toBe(false));
    act(() => result.current.setFormField("recipientName", "João Silva"));
    act(() => result.current.setFormField("recipientCPF", "52998224725"));
    act(() => result.current.setFormField("courseName", "React"));
    act(() => result.current.setFormField("courseHours", 40));
    act(() => result.current.setFormField("validityDate", "2027-01-01"));
    act(() => result.current.setFormField("email", "joao@test.com"));
    await act(async () => {
      await result.current.submit({ preventDefault: jest.fn() } as any);
    });
    expect(api.emitCertificate).toHaveBeenCalledWith({
      recipientName: "João Silva",
      recipientCPF: "52998224725",
      courseName: "React",
      courseHours: 40,
      validityDate: expect.any(String),
      templateId: "tpl-1",
    });
    expect(envios.add).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/certificados" });
  });

  it("submit does not call envios.add when email is empty", async () => {
    (api.listTemplates as jest.Mock).mockResolvedValue(mockTemplates);
    (api.emitCertificate as jest.Mock).mockResolvedValue({
      id: "cert-1",
      recipientName: "João Silva",
      recipientCPF: "52998224725",
      courseName: "React",
      courseHours: 40,
      verificationCode: "ABC123",
      validityDate: "2027-01-01T00:00:00.000Z",
      templateId: "tpl-1",
      issuedAt: "2026-06-10T00:00:00.000Z",
      createdAt: "2026-06-10T00:00:00.000Z",
      updatedAt: "2026-06-10T00:00:00.000Z",
    });
    const { result } = renderHook(() => useEmitCertificateViewModel());
    await waitFor(() => expect(result.current.loadingTemplates).toBe(false));
    act(() => result.current.setFormField("recipientName", "João Silva"));
    act(() => result.current.setFormField("recipientCPF", "52998224725"));
    await act(async () => {
      await result.current.submit({ preventDefault: jest.fn() } as any);
    });
    expect(envios.add).not.toHaveBeenCalled();
  });

  it("submit sets validation errors from API details", async () => {
    (api.listTemplates as jest.Mock).mockResolvedValue(mockTemplates);
    (api.emitCertificate as jest.Mock).mockRejectedValue({
      details: [{ field: "recipientName", message: "Nome é obrigatório" }],
    });
    const { result } = renderHook(() => useEmitCertificateViewModel());
    await waitFor(() => expect(result.current.loadingTemplates).toBe(false));
    act(() => result.current.setFormField("recipientName", "João Silva"));
    act(() => result.current.setFormField("recipientCPF", "52998224725"));
    await act(async () => {
      await result.current.submit({ preventDefault: jest.fn() } as any);
    });
    expect(result.current.errors).toEqual([{ field: "recipientName", message: "Nome é obrigatório" }]);
  });

  it("submit sets general error from API message", async () => {
    (api.listTemplates as jest.Mock).mockResolvedValue(mockTemplates);
    (api.emitCertificate as jest.Mock).mockRejectedValue(new Error("Servidor ocupado"));
    const { result } = renderHook(() => useEmitCertificateViewModel());
    await waitFor(() => expect(result.current.loadingTemplates).toBe(false));
    act(() => result.current.setFormField("recipientName", "João Silva"));
    act(() => result.current.setFormField("recipientCPF", "52998224725"));
    await act(async () => {
      await result.current.submit({ preventDefault: jest.fn() } as any);
    });
    expect(result.current.errors).toEqual([{ field: "geral", message: "Servidor ocupado" }]);
  });

  it("submit sets unknown error when no message or details", async () => {
    (api.listTemplates as jest.Mock).mockResolvedValue(mockTemplates);
    (api.emitCertificate as jest.Mock).mockRejectedValue({});
    const { result } = renderHook(() => useEmitCertificateViewModel());
    await waitFor(() => expect(result.current.loadingTemplates).toBe(false));
    act(() => result.current.setFormField("recipientName", "João Silva"));
    act(() => result.current.setFormField("recipientCPF", "52998224725"));
    await act(async () => {
      await result.current.submit({ preventDefault: jest.fn() } as any);
    });
    expect(result.current.errors).toEqual([{ field: "geral", message: "Erro desconhecido ao emitir certificado" }]);
  });

  it("cancel navigates to /certificados", async () => {
    (api.listTemplates as jest.Mock).mockResolvedValue(mockTemplates);
    const { result } = renderHook(() => useEmitCertificateViewModel());
    await waitFor(() => expect(result.current.loadingTemplates).toBe(false));
    act(() => result.current.cancel());
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/certificados" });
  });

  it("clearErrors resets errors", async () => {
    (api.listTemplates as jest.Mock).mockResolvedValue(mockTemplates);
    const { result } = renderHook(() => useEmitCertificateViewModel());
    await waitFor(() => expect(result.current.loadingTemplates).toBe(false));
    act(() => result.current.clearErrors());
    expect(result.current.errors).toEqual([]);
  });

  it("getFieldError returns error for specific field", async () => {
    (api.listTemplates as jest.Mock).mockResolvedValue(mockTemplates);
    const { result } = renderHook(() => useEmitCertificateViewModel());
    await waitFor(() => expect(result.current.loadingTemplates).toBe(false));
    act(() => result.current.setFormField("recipientCPF", "123"));
    await act(async () => {
      await result.current.submit({ preventDefault: jest.fn() } as any);
    });
    expect(result.current.getFieldError("recipientCPF")).toBe("CPF inválido. Digite um CPF com 11 dígitos válidos.");
    expect(result.current.getFieldError("recipientName")).toBeUndefined();
  });

  it("generalErrors filters only geral errors", async () => {
    (api.listTemplates as jest.Mock).mockResolvedValue(mockTemplates);
    (api.emitCertificate as jest.Mock).mockRejectedValue(new Error("Erro geral"));
    const { result } = renderHook(() => useEmitCertificateViewModel());
    await waitFor(() => expect(result.current.loadingTemplates).toBe(false));
    act(() => result.current.setFormField("recipientName", "João"));
    act(() => result.current.setFormField("recipientCPF", "52998224725"));
    await act(async () => {
      await result.current.submit({ preventDefault: jest.fn() } as any);
    });
    expect(result.current.generalErrors).toHaveLength(1);
    expect(result.current.generalErrors[0].field).toBe("geral");
  });
});
